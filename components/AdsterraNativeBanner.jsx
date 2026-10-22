
"use client";

import { useEffect, useRef } from "react";

export default function AdsterraNativeBanner() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.dataset.loaded === "true") return;

    container.dataset.loaded = "true";

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src =
      "https://bauval.org/21/7877c292669f66347ff416e569063764";

    container.appendChild(script);

    return () => {
      // Do not remove the ad script during ordinary page rendering.
    };
  }, []);

  return (
    <aside
      className="adsterra-native-wrap"
      aria-label="Advertisement"
    >
      <p className="ad-label">Advertisement</p>
      <div
        id="container-7877c292669f66347ff416e569063764"
        ref={containerRef}
      />
    </aside>
  );
}
