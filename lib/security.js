import crypto from "node:crypto";
import { sharedRateLimit } from "./store";
const buckets = new Map();
export function clientKey(request) {
  // Prefer the reverse-proxy supplied single IP. Forwarded headers are only trustworthy when the host overwrites them.
  const raw = request.headers.get("x-real-ip")?.trim() || request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() || "unknown";
  return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 32);
}
export async function rateLimit(request, { limit = 30, windowMs = 60_000, scope = "general" } = {}) {
  const key = `${scope}:${clientKey(request)}`;
  try { const shared = await sharedRateLimit(key, limit, windowMs); if (shared) return shared; } catch (e) { if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) throw e; }
  const now = Date.now(); let item = buckets.get(key);
  if (!item || item.resetAt <= now) item = { count: 0, resetAt: now + windowMs };
  item.count += 1; buckets.set(key, item);
  if (buckets.size > 5000) for (const [k,v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  return { allowed: item.count <= limit, retryAfter: Math.max(1, Math.ceil((item.resetAt-now)/1000)) };
}
export function rateLimitResponse(retryAfter) { return Response.json({ error: "Too many requests. Please wait and try again." }, { status: 429, headers: { "Retry-After": String(retryAfter), "Cache-Control": "no-store" } }); }
export function requestBodyTooLarge(request, maxBytes) { const n=Number(request.headers.get("content-length")||0); return Number.isFinite(n)&&n>maxBytes; }
export function jsonError(message,status=400) { return Response.json({error:message},{status,headers:{"Cache-Control":"no-store"}}); }
