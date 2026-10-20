import Script from "next/script";

/**
 * AdSense slot. It intentionally renders nothing until a real, approved
 * publisher ID and slot ID are configured in the deployment environment.
 */
export default function AdSlot({ slot, format = "auto", label = "Advertisement" }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client || !/^ca-pub-\d{10,}$/.test(client) || !slot || !/^\d{5,}$/.test(String(slot))) {
    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ADS_PREVIEW === "true") {
      return <div className="ad-slot ad-slot-preview" aria-label="Ad placeholder">Ad placement preview — configure approved AdSense IDs to serve ads.</div>;
    }
    return null;
  }
  return (
    <div className="ad-slot" aria-label={label}>
      <span className="ad-label">{label}</span>
      <ins className="adsbygoogle"
        style={{ display: "block", minHeight: "90px" }}
        data-ad-client={client}
        data-ad-slot={String(slot)}
        data-ad-format={format}
        data-full-width-responsive="true" />
      <Script id={`toolnest-adsense-init-${slot}`} strategy="afterInteractive">
        {"(window.adsbygoogle = window.adsbygoogle || []).push({});"}
      </Script>
    </div>
  );
}
