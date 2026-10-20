import Link from "next/link";
import { notFound } from "next/navigation";
import tools from "../../../lib/tools.json";
import ToolClient from "../../../components/ToolClient";
import BugReport from "../../../components/BugReport";
import AdSlot from "../../../components/AdSlot";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://toolnest.qd.je";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};
  return {
    title: tool.seoTitle,
    description: tool.description,
    robots: { index: Boolean(tool.indexReady && process.env.INDEX_TOOLS === "true"), follow: true },
    alternates: { canonical: `${siteUrl}/tools/${tool.slug}` },
    
    openGraph: {
      title: tool.seoTitle,
      description: tool.description,
      url: `${siteUrl}/tools/${tool.slug}`,
      type: "website"
    },
    twitter: { card: "summary", title: tool.seoTitle, description: tool.description }
  };
}

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  const toolCanIndex = Boolean(tool.indexReady && process.env.INDEX_TOOLS === "true");
  const related = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 5);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "description": tool.description,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/">Tool<span>Nest</span></Link>
          <nav className="header-links" aria-label="Main navigation"><Link href="/">All tools</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link></nav>
        </div>
      </header>
      <main id="main" className="container">
        <div className="breadcrumbs"><Link href="/">Home</Link> / <Link href="/#categories">{tool.category}</Link> / {tool.name}</div>
        <div className="eyebrow">{tool.category}</div>
        <h1>{tool.name}</h1>
        <p className="lead">{tool.description}</p>
        {!toolCanIndex && <div className="notice" style={{marginBottom:"18px"}}><strong>Indexing status: noindex until launch review.</strong> {tool.indexReady ? "This tool is a launch candidate, but tool indexing is disabled until the real build, dependency installation and browser QA have passed. Enable INDEX_TOOLS only after testing." : "This page still needs a complete processor, specialist integration or edge-case QA. Do not rely on it for critical work; keep it noindex until the feature is completed and tested."}</div>}
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_TOOL_TOP_SLOT} />
        <div className="tool-layout">
          <section className="panel" aria-label={`${tool.name} tool`}>
            <ToolClient tool={tool} />
            <BugReport tool={tool.name} />
          </section>
          <aside className="panel">
            <h2>Before you use it</h2>
            <p className="small">{tool.researchNote}</p>
            <div className="notice small"><strong>Accuracy and privacy:</strong> Check the result and the tool’s stated limits before using it for important work. Do not upload confidential files unless the implementation and its data handling have been verified.</div>
            <h3 style={{marginTop: "18px"}}>Related tools</h3>
            <div className="link-list">{related.map((item) => <Link href={`/tools/${item.slug}`} key={item.slug}>{item.name} →</Link>)}</div>
          </aside>
        </div>
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_TOOL_BOTTOM_SLOT} />
        <article className="tool-copy">
          <section><h2>How to use {tool.name}</h2>
            <ol>{(tool.howTo || []).map((step, i) => <li key={i}>{step}</li>)}</ol>
          </section>
          <section><h2>When to use this tool</h2><p>{tool.useCases || tool.description}</p><p>{tool.researchNote}</p></section>
          <section><h2>Limitations and accuracy</h2><p>{tool.limitations || "Review the output before using it for important work. Results depend on input quality, browser support and any external service used by the feature."}</p></section>
          <section><h2>Frequently asked questions</h2>
            {(tool.faqs || []).map((faq, i) => <div className="faq" key={i}><h3>{faq.q}</h3><p>{faq.a}</p></div>)}
          </section>
        </article>
        <footer className="footer"><div className="footer-nav"><Link href="/">All tools</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/disclaimer">Disclaimer</Link></div><p>Built for practical utility. Content and functionality should be reviewed before production launch.</p></footer>
      </main>
      {toolCanIndex ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
    </>
  );
}
