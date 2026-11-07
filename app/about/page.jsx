import { siteUrl } from "../../lib/site";
import Link from "next/link";
export const metadata = { title: "About ToolNest", description: "ToolNest offers free online PDF, image, calculator, text and developer tools that run in your browser.", alternates: { canonical: `${siteUrl}/about` } };
export default function Page() {
  return (
    <>
      <header className="site-header"><div className="header-inner"><Link className="brand" href="/">Tool<span>Nest</span></Link><nav className="header-links" aria-label="Main navigation"><Link href="/">All tools</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link></nav></div></header>
      <main id="main" className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / About</nav>
        <article className="tool-copy">
          <h1>About ToolNest</h1>
          <p>ToolNest is a free collection of online tools for everyday work and study: PDF utilities, image converters, calculators, text tools, developer utilities and small SEO and marketing helpers. The goal is simple: get a common task done in a few clicks, without installing software or creating an account.</p>
          <h2>How the tools work</h2>
          <p>Most tools run directly in your browser, which means the text or files you use are processed on your device rather than uploaded to our servers. Every tool page explains how to use it, what its limits are and which questions people commonly ask. If a tool is not finished yet, it is marked “Coming soon” and kept out of search results.</p>
          <h2>How ToolNest is funded</h2>
          <p>The tools are free to use. The site shows advertising to cover hosting and development costs. Ads are labelled, and we do not let advertisers change how a tool calculates or converts.</p>
          <h2>Accuracy</h2>
          <p>We test tools before listing them, but results should always be checked before you rely on them for financial, medical, legal or other important decisions. See the <Link href="/disclaimer">disclaimer</Link> for details.</p>
          <h2>Get in touch</h2>
          <p>Found a bug or have a tool request? Use the <Link href="/contact">contact page</Link>.</p>
        </article>
        <footer className="footer"><div className="footer-nav"><Link href="/">All tools</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/disclaimer">Disclaimer</Link></div></footer>
      </main>
    </>
  );
}
