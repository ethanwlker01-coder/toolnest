import "./globals.css";
import AnalyticsTracker from "../components/AnalyticsTracker";

import { siteUrl } from "../lib/site";

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
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "ToolNest",
    url: siteUrl,
    title: "Free Online Tools: Converters, Calculators & Utilities",
    description:
      "Useful browser tools for everyday work, study and development.",
    locale: "en_IN"
  },
  twitter: { card: "summary", title: "ToolNest – Free Online Tools", description: "Free calculators, PDF, image, text and developer tools." }
};

const adsenseClient = /^ca-pub-\d{10,}$/.test(process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "")
  ? process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  : "ca-pub-7526438521592642";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-7526438521592642"
        />
        {adsenseClient ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>

      <body>
        <AnalyticsTracker />

        
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        {children}
      </body>
    </html>
  );
}
