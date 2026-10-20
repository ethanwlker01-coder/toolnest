/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
      { key: "Origin-Agent-Cluster", value: "?1" },
      { key: "Content-Security-Policy", value: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob: https:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ""} https://pagead2.googlesyndication.com https://www.googletagservices.com; connect-src 'self' https:; frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com; media-src 'self' blob:; worker-src 'self' blob:; upgrade-insecure-requests` }
    ] }];
  },
  async redirects() {
    return [
      { source: "/tools/pdf-to-jpg", destination: "/tools/pdf-to-images", permanent: true },
      { source: "/tools/pdf-to-png", destination: "/tools/pdf-to-images", permanent: true },
      { source: "/tools/gst-calculator-duplicate", destination: "/tools/gst-calculator", permanent: true },
      { source: "/tools/fuel-cost-calculator-duplicate", destination: "/tools/fuel-cost-calculator", permanent: true },
      { source: "/tools/live-currency-converter", destination: "/tools/currency-converter", permanent: true }
    ];
  }
};
export default nextConfig;
