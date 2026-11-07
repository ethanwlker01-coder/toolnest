"use client";

import { useEffect, useRef } from "react";
import { getPlacement } from "../lib/ads";

// One Adsterra placement. Renders nothing until configured.
export default function AdZone({ placement }) {
  const ref = useRef(null);
  const cfg = getPlacement(placement);

  // Native banners: append the unit's script into its container.
  useEffect(() => {
    const el = ref.current;
    if (!cfg || cfg.type !== "native" || !el || el.dataset.loaded === "true") return;
    el.dataset.loaded = "true";
    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = cfg.src;
    el.appendChild(s);
  }, [cfg]);

  if (!cfg) return null;

  if (cfg.type === "banner") {
    // Each banner lives in its own iframe so several atOptions never collide.
    const doc =
      `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>` +
      `<script>atOptions={'key':'${cfg.key}','format':'iframe','height':${cfg.height},'width':${cfg.width},'params':{}};<\/script>` +
      `<script src="${cfg.src}"><\/script></body></html>`;
    return (
      <aside className="adsterra-native-wrap" aria-label="Advertisement" style={{ minHeight: cfg.height + 30 }}>
        <p className="ad-label">Advertisement</p>
        <iframe
          title={`Advertisement ${placement}`}
          srcDoc={doc}
          width={cfg.width}
          height={cfg.height}
          loading="lazy"
          scrolling="no"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
          style={{ border: 0, display: "block", margin: "0 auto", maxWidth: "100%" }}
        />
      </aside>
    );
  }

  return (
    <aside className="adsterra-native-wrap" aria-label="Advertisement" style={{ minHeight: 250 }}>
      <p className="ad-label">Advertisement</p>
      <div id={`container-${cfg.key}`} ref={ref} />
    </aside>
  );
}
