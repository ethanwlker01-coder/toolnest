// Adsterra placement config. Paste the script URL from Adsterra's
// "Native Banner" code (https://<domain>/<n>/<key>) into the env vars below.
const DEFAULT_RESULT_SRC = "https://bauval.org/21/7877c292669f66347ff416e569063764";

const RAW = {
  result: process.env.NEXT_PUBLIC_ADSTERRA_RESULT_SRC || DEFAULT_RESULT_SRC,
  sidebar: process.env.NEXT_PUBLIC_ADSTERRA_SIDEBAR_SRC || "",
  bottom: process.env.NEXT_PUBLIC_ADSTERRA_BOTTOM_SRC || ""
};

function parse(src) {
  try {
    const u = new URL(src);
    if (u.protocol !== "https:") return null;
    const key = u.pathname.split("/").filter(Boolean).pop() || "";
    if (!/^[a-f0-9]{16,}$/i.test(key)) return null;
    return { src: u.toString(), key };
  } catch {
    return null;
  }
}

// Returns { src, key } or null. Duplicate keys are dropped because the
// ad script targets a container id derived from the key.
export function getPlacement(name) {
  const order = ["result", "sidebar", "bottom"];
  const seen = new Set();
  for (const n of order) {
    const p = parse(RAW[n]);
    if (!p || seen.has(p.key)) { if (n === name) return null; continue; }
    seen.add(p.key);
    if (n === name) return p;
  }
  return null;
}
