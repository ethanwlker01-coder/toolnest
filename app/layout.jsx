import "./globals.css";
import AnalyticsTracker from "../components/AnalyticsTracker";
import Script from "next/script";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://toolnest-lyart.vercel.app"
).replace(/\/+$/, "");

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free Online Tools: Converters & Calculators | ToolNest",
    template: "%s | ToolNest"
  },
  description:
    "Free online calculators, image converters, PDF utilities, text tools and developer utilities that help you finish everyday tasks quickly.",
  applicationName: "ToolNest",
  category: "utilities",
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "ToolNest",
    url: siteUrl,
    title: "Free Online Tools: Converters, Calculators & Utilities",
    description:
      "Useful browser tools for everyday work, study and development."
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-7526438521592642"
        />
      </head>

      <body>
        <AnalyticsTracker />

        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT &&
        /^ca-pub-\d{10,}$/.test(
          process.env.NEXT_PUBLIC_ADSENSE_CLIENT
        ) ? (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        ) : null}

        <a className="skip-link" href="#main">
          Skip to content
        </a>

        {children}
      </body>
    </html>
  );
}
