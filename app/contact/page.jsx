import { siteUrl } from "../../lib/site";
import Link from "next/link";
export const metadata = { title: "Contact", description: "Contact ToolNest to report a bug, request a tool or ask a privacy question.", alternates: { canonical: `${siteUrl}/contact` } };
export default function Page() {
  return (
    <>
      <header className="site-header"><div className="header-inner"><Link className="brand" href="/">Tool<span>Nest</span></Link><nav className="header-links" aria-label="Main navigation"><Link href="/">All tools</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link></nav></div></header>
      <main id="main" className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / Contact</nav>
        <article className="tool-copy">
          <h1>Contact ToolNest</h1>
          <p>We read every message about bugs, wrong results, tool requests and privacy questions.</p>
          {process.env.NEXT_PUBLIC_CONTACT_EMAIL ? (
            <p><strong>Email:</strong> <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}>{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</a></p>
          ) : null}
          <h2>Report a problem</h2>
          <p>Open any tool and use the “Report a bug” form under the tool. Please describe what you tried and what went wrong. Do not include passwords or confidential files.</p>
          <h2>Request a tool</h2>
          <p>Tell us which free tool you would like to see. Popular requests are built first.</p>
          <p>See also: <Link href="/privacy">Privacy Policy</Link> · <Link href="/about">About</Link></p>
        </article>
        <footer className="footer"><div className="footer-nav"><Link href="/">All tools</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/disclaimer">Disclaimer</Link></div></footer>
      </main>
    </>
  );
}
