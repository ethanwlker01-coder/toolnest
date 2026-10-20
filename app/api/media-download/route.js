import { spawn } from "node:child_process";
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { rateLimit, rateLimitResponse, requestBodyTooLarge } from "../../../lib/security";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_BYTES = 100 * 1024 * 1024;
const MAX_DURATION_SECONDS = 600;
const ALLOWED_HOSTS = [
  "youtube.com", "youtu.be", "instagram.com", "tiktok.com",
  "facebook.com", "fb.watch", "x.com", "twitter.com", "vimeo.com"
];

function allowedPublicUrl(raw) {
  let url;
  try { url = new URL(raw); } catch { return false; }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return false;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (!ALLOWED_HOSTS.some((domain) => host === domain || host.endsWith(`.${domain}`))) return false;
  if (["localhost", "127.0.0.1", "::1"].includes(host) || host.endsWith(".local")) return false;
  return true;
}

function run(command, args, timeoutMs = 110_000) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "ignore", "pipe"], windowsHide: true });
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("Media processing timed out. Try a shorter public video."));
    }, timeoutMs);
    child.stderr.on("data", (chunk) => { stderr = (stderr + chunk.toString()).slice(-5000); });
    child.on("error", (error) => { clearTimeout(timer); reject(error); });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(stderr.includes("not found") ? "Required media tool is missing on the server. Install yt-dlp and ffmpeg." : "Media processing failed. The URL may be private, unsupported, restricted or unavailable."));
    });
  });
}

async function findOutput(dir) {
  const entries = await readdir(dir);
  const candidate = entries.find((name) => /^(converted|download)\./.test(name) && !name.endsWith(".part") && !name.endsWith(".ytdl"));
  if (!candidate) throw new Error("No output file was produced.");
  const filePath = path.join(dir, candidate);
  const info = await stat(filePath);
  if (!info.isFile() || info.size <= 0 || info.size > MAX_BYTES) throw new Error("Output is empty or exceeds the 100 MB limit.");
  return { filePath, name: candidate };
}

export async function POST(request) {
  const rate = await rateLimit(request, { limit: 5, windowMs: 10 * 60_000, scope: "media-download" });
  if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
  // Multipart bodies include overhead; allow a small margin over the 100 MB file cap.
  if (requestBodyTooLarge(request, MAX_BYTES + 2 * 1024 * 1024)) return Response.json({ error: "Request exceeds the 102 MB upload limit." }, { status: 413 });
  const workDir = await mkdtemp(path.join(os.tmpdir(), "toolnest-media-"));
  try {
    let format = "video";
    let inputPath;
    let originalName = "media";
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      format = String(form.get("format") || "audio").toLowerCase();
      if (!(file instanceof File)) return Response.json({ error: "Upload a media file first." }, { status: 400 });
      if (file.size <= 0 || file.size > MAX_BYTES) return Response.json({ error: "Upload a file smaller than 100 MB." }, { status: 413 });
      originalName = path.basename(file.name || "media").replace(/[^\w.-]/g, "_").slice(0, 100);
      inputPath = path.join(workDir, originalName);
      await writeFile(inputPath, Buffer.from(await file.arrayBuffer()));
      if (!["audio", "video"].includes(format)) return Response.json({ error: "Unsupported output format." }, { status: 400 });
      const outputTemplate = path.join(workDir, "converted.%(ext)s");
      if (format === "audio") {
        await run("ffmpeg", ["-nostdin", "-y", "-i", inputPath, "-vn", "-codec:a", "libmp3lame", "-q:a", "3", "-t", String(MAX_DURATION_SECONDS), outputTemplate.replace("%(ext)s", "mp3")]);
      } else {
        await run("ffmpeg", ["-nostdin", "-y", "-i", inputPath, "-c:v", "libx264", "-c:a", "aac", "-movflags", "+faststart", "-t", String(MAX_DURATION_SECONDS), outputTemplate.replace("%(ext)s", "mp4")]);
      }
    } else {
      const body = await request.json();
      const url = String(body.url || "").trim();
      format = String(body.format || "video").toLowerCase();
      if (!allowedPublicUrl(url)) return Response.json({ error: "Use a public URL from a supported platform. Private URLs, login/cookie sessions and unsupported hosts are not accepted." }, { status: 400 });
      if (!["audio", "video"].includes(format)) return Response.json({ error: "Choose video or audio output." }, { status: 400 });
      const outputTemplate = path.join(workDir, "download.%(ext)s");
      const args = [
        "--no-playlist", "--no-warnings", "--socket-timeout", "15",
        "--max-filesize", `${MAX_BYTES}`, "--match-filter", `duration <= ${MAX_DURATION_SECONDS}`,
        "--output", outputTemplate
      ];
      if (format === "audio") args.push("-x", "--audio-format", "mp3", "--audio-quality", "5");
      else args.push("-f", "best[ext=mp4]/best", "--merge-output-format", "mp4");
      args.push(url);
      await run("yt-dlp", args);
    }

    const { filePath, name } = await findOutput(workDir);
    const bytes = await readFile(filePath);
    const ext = path.extname(name).toLowerCase();
    const mime = ext === ".mp3" ? "audio/mpeg" : ext === ".mp4" ? "video/mp4" : "application/octet-stream";
    const filename = `${format === "audio" ? "media-audio" : "media-video"}${ext || (format === "audio" ? ".mp3" : ".mp4")}`;
    return new Response(bytes, {
      headers: {
        "Content-Type": mime,
        "Content-Length": String(bytes.length),
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    const message = String(error?.message || "");
    const userMessage = message.includes("ENOENT") || message.includes("not found")
      ? "Server dependency missing: install yt-dlp and ffmpeg and ensure both are available on PATH."
      : (message || "Media processing failed.");
    return Response.json({ error: userMessage }, { status: 500 });
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}
