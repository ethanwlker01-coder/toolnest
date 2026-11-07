import Link from "next/link";
import tools from "../lib/tools.json";
import categories from "../lib/categories.json";
import AdSlot from "../components/AdSlot";
import AdsterraNativeBanner from "../components/AdsterraNativeBanner";
import { siteUrl, toolIsIndexable } from "../lib/site";

const groups = [...new Set(tools.map((t) => t.category))];

export const metadata = {
  title: { absolute: "ToolNest – Free Online Tools: PDF, Image, Calculators & More" },
  description: "Free online PDF tools, image converters, calculators, text and developer utilities. No signup, most tools run right in your browser.",
  alternates: { canonical: siteUrl }
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ToolNest",
  url: siteUrl,
  potentialAction: { "@type": "SearchAction", target: `${siteUrl}/search?q={search_term_string}`, "query-input": "required name=search_term_string" }
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/">Tool<span>Nest</span></Link>
          <nav className="header-links" aria-label="Main navigation">
            <a href="#categories">Categories</a><Link href="/about">About</Link><Link href="/privacy">Privacy</Link>
          </nav>
        </div>
      </header>
      <main id="main" className="container">
        <section className="hero">
          <div className="eyebrow">Free browser-based utilities</div>
          <h1>Free Online Tools for Everyday Tasks</h1>
          <p className="lead">Use free online calculators, image converters, PDF utilities, text tools and developer tools for everyday work and study. Supported tools run in your browser; each page explains its features and limitations.</p>
          <form className="search-box" action="/search" method="get">
            <input name="q" aria-label="Search tools" placeholder="Search tools, e.g. JSON formatter or GST calculator" />
            <button type="submit">Search tools</button>
          </form>
          <div className="stat-row">
            <div className="stat"><b>{tools.length}</b><span className="small muted">free online tools</span></div>
            <div className="stat"><b>Browser-first</b><span className="small muted">for supported tools</span></div>
            <div className="stat"><b>No account</b><span className="small muted">required for the core tools</span></div>
          </div>
          <p className="small muted">Most tools process your input in your browser. Each tool page explains its features, limits and how your data is handled.</p>
        </section>

        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT} />

        <section className="adsterra-placement">
          <AdsterraNativeBanner />
        </section>

        <section id="categories">
          {groups.map((category) => {
            const entries = tools.filter((t) => t.category === category);
            return (
              <div className="category-section" key={category}>
                <div className="category-heading">
                  <h2><Link href={`/category/${categories.find(c => c.category === category)?.slug || ""}`}>{category}</Link></h2><span className="muted small">{entries.length} tools</span>
                </div>
                <div className="tool-grid">
                  {entries.map((tool) => (
                    <Link className="tool-card" href={`/tools/${tool.slug}`} key={tool.slug}>
                      <span className="pill">{toolIsIndexable(tool) ? "Free" : "Coming soon"}</span>
                      <h3>{tool.name}</h3>
                      <p>{tool.description}</p>
                      <strong>Open tool →</strong>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
        <section className="tool-copy">
          <h2>Why use ToolNest?</h2>
          <p>ToolNest is a collection of free online tools for everyday tasks: merge, split and compress PDFs, convert and resize images, calculate EMI, GST and BMI, clean up text, and format JSON or generate SEO tags. There is nothing to install and no account to create.</p>
          <p>Where a tool runs entirely in your browser, it says so on its page, so your files are not uploaded to our servers for that operation. Every tool lists its limitations, so you know what to double-check before relying on the result.</p>
        </section>
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT} />
        <footer className="footer">
          <div className="footer-nav"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/disclaimer">Disclaimer</Link></div>
          <p>Tools are provided as general utilities. Review results before using them for financial, health, legal or production-critical decisions.</p>
        </footer>
      </main>
    </>
  );
}
