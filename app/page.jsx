import Link from "next/link";
import tools from "../lib/tools.json";
import categories from "../lib/categories.json";
import AdSlot from "../components/AdSlot";

const groups = [...new Set(tools.map((t) => t.category))];

export const metadata = { alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://toolnest.qd.je" } };

export default function HomePage() {
  return (
    <>
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
            <div className="stat"><b>{tools.length}</b><span className="small muted">canonical tool pages</span></div>
            <div className="stat"><b>Browser-first</b><span className="small muted">for supported tools</span></div>
            <div className="stat"><b>No account</b><span className="small muted">required for the core tools</span></div>
          </div>
          <p className="small muted">Privacy note: only claim that data stays on your device for tools that truly process everything locally. Some advanced conversions may require a browser library or a separately configured API.</p>
        </section>
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT} />
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
                      <span className="pill">{tool.status === "ai-planned" ? "AI integration planned" : tool.status === "server-required" ? "Server setup required" : tool.status === "limited" ? "Limited functionality" : tool.indexReady ? "Ready for review" : "Not indexed yet"}</span>
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
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT} />
        <footer className="footer">
          <div className="footer-nav"><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/disclaimer">Disclaimer</Link></div>
          <p>Tools are provided as general utilities. Review results before using them for financial, health, legal or production-critical decisions.</p>
        </footer>
      </main>
    </>
  );
}
