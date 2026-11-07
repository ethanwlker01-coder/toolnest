import { siteUrl } from "../../lib/site";
import Link from "next/link";
export const metadata = { title: "Privacy Policy", description: "How ToolNest handles your data, cookies and advertising.", alternates: { canonical: `${siteUrl}/privacy` } };
export default function Page() {
  return (
    <>
      <header className="site-header"><div className="header-inner"><Link className="brand" href="/">Tool<span>Nest</span></Link><nav className="header-links" aria-label="Main navigation"><Link href="/">All tools</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link></nav></div></header>
      <main id="main" className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / Privacy Policy</nav>
        <article className="tool-copy">
          <h1>Privacy Policy</h1>
          <p>Last updated: November 2026. This policy explains what ToolNest (toolnest-lyart.vercel.app) collects and how it is used.</p>
          <h2>Your files and text</h2>
          <p>Most tools process what you enter or select inside your browser, so the content is not uploaded to ToolNest servers for that operation. Each tool page states its limits. A few features contact an outside service, for example live exchange rates for the currency converter, and OCR may load language data from a third-party delivery network. Avoid entering confidential information into any online tool unless you are comfortable with how it works.</p>
          <h2>Information we collect</h2>
          <ul>
            <li><strong>Basic analytics:</strong> page views, an anonymous browser identifier stored in your browser, and which tool controls are used. This is used to understand which tools are useful.</li>
            <li><strong>Usage limits:</strong> to keep the service fair, we apply a daily free allowance per browser and rate limits, which may use cookies or technical request data such as IP address.</li>
            <li><strong>Bug reports:</strong> if you submit a report, we store your message and the optional email address you provide, so we can fix the problem and reply. Do not include passwords or sensitive data.</li>
          </ul>
          <h2>Advertising and cookies</h2>
          <p>ToolNest is supported by advertising. We may show ads from Google AdSense and from the Adsterra network. These providers and their partners may use cookies, device identifiers and similar technologies to serve, measure and personalize ads. Google’s use of advertising cookies lets it and its partners serve ads based on visits to this and other sites. You can manage personalized advertising at <a href="https://adssettings.google.com" rel="noopener noreferrer">Google Ad Settings</a>, and learn how Google uses data from partner sites at <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>. You can also block or delete cookies in your browser settings, although some features may then work less well.</p>
          <h2>Third parties</h2>
          <p>We do not sell personal information. Advertising partners and hosting providers process data under their own privacy policies.</p>
          <h2>Children</h2>
          <p>ToolNest is a general-audience utility site and is not directed to children under 13.</p>
          <h2>Changes and contact</h2>
          <p>We may update this policy and will change the date above when we do. Questions? See the <Link href="/contact">contact page</Link>.</p>
        </article>
        <footer className="footer"><div className="footer-nav"><Link href="/">All tools</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/disclaimer">Disclaimer</Link></div></footer>
      </main>
    </>
  );
}
