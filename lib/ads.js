// Adsterra placement config.
//  - "native"  : script URL from a Native Banner unit  (https://<domain>/<n>/<key>)
//  - "banner"  : iframe-format banner unit (key + width x height from its code)
// Defaults below match the units created for toolnest-lyart.vercel.app.
// Override per placement with env vars, or set a placement to "off" to hide it:
//   NEXT_PUBLIC_ADSTERRA_<RESULT|SIDEBAR|BOTTOM>_SRC     native script URL
//   NEXT_PUBLIC_ADSTERRA_<SIDEBAR|BOTTOM>_BANNER         "<key>:<width>x<height>"
//   NEXT_PUBLIC_ADSTERRA_BANNER_HOST                     default bauval.org
const HOST = process.env.NEXT_PUBLIC_ADSTERRA_BANNER_HOST || "bauval.org";

const DEFAULTS = {
  result: { type: "native", src: "https://bauval.org/21/7877c292669f66347ff416e569063764" },
  sidebar: { type: "banner", key: "0c979a6b5fc06bbf30d08f3fbcfb85af", width: 300, height: 250 },
  bottom: { type: "banner", key: "ca6267189c3462ddd6b7d5a097807e8c", width: 160, height: 300 }
};

// NEXT_PUBLIC_* must be referenced literally so Next can inline them.
const ENV = {
  result: { src: process.env.NEXT_PUBLIC_ADSTERRA_RESULT_SRC, banner: undefined },
  sidebar: { src: process.env.NEXT_PUBLIC_ADSTERRA_SIDEBAR_SRC, banner: process.env.NEXT_PUBLIC_ADSTERRA_SIDEBAR_BANNER },
  bottom: { src: process.env.NEXT_PUBLIC_ADSTERRA_BOTTOM_SRC, banner: process.env.NEXT_PUBLIC_ADSTERRA_BOTTOM_BANNER }
};

const HEX = /^[a-f0-9]{16,}$/i;

function parseNative(src) {
  try {
    const u = new URL(src);
    if (u.protocol !== "https:") return null;
    const key = u.pathname.split("/").filter(Boolean).pop() || "";
    return HEX.test(key) ? { type: "native", src: u.toString(), key } : null;
  } catch { return null; }
}

function parseBanner(value) {
  const m = /^([a-f0-9]{16,}):(\d{2,4})x(\d{2,4})$/i.exec(value || "");
  if (!m) return null;
  const key = m[1];
  return { type: "banner", key, width: +m[2], height: +m[3], src: `https://${HOST}/22/${key}` };
}

function resolve(name) {
  const env = ENV[name];
  if (env.src === "off" || env.banner === "off") return null;
  if (env.src) return parseNative(env.src);
  if (env.banner) return parseBanner(env.banner);
  const d = DEFAULTS[name];
  return d.type === "native" ? parseNative(d.src) : { ...d, src: `https://${HOST}/22/${d.key}` };
}

// Returns a placement config or null. Duplicate keys are dropped.
export function getPlacement(name) {
  const seen = new Set();
  for (const n of ["result", "sidebar", "bottom"]) {
    const p = resolve(n);
    if (!p || seen.has(p.key)) { if (n === name) return null; continue; }
    seen.add(p.key);
    if (n === name) return p;
  }
  return null;
}
