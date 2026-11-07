"use client";

import { useEffect, useRef } from "react";
import { getPlacement } from "../lib/ads";

// One Adsterra native banner placement. Renders nothing until configured.
export default function AdZone({ placement, minHeight = 250 }) {
  const ref = useRef(null);
  const cfg = getPlacement(placement);

  useEffect(() => {
    const el = ref.current;
    if (!cfg || !el || el.dataset.loaded === "true") return;
    el.dataset.loaded = "true";
    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = cfg.src;
    el.appendChild(s);
  }, [cfg]);

  if (!cfg) return null;
  return (
    <aside className="adsterra-native-wrap" aria-label="Advertisement" style={{ minHeight }}>
      <p className="ad-label">Advertisement</p>
      <div id={`container-${cfg.key}`} ref={ref} />
    </aside>
  );
}
