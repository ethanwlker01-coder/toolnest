import Link from "next/link";
import { notFound } from "next/navigation";
import tools from "../../../lib/tools.json";
import categories from "../../../lib/categories.json";
import { siteUrl, toolIsIndexable } from "../../../lib/site";
import ToolClient from "../../../components/ToolClient";
import BugReport from "../../../components/BugReport";
import AdSlot from "../../../components/AdSlot";
import AdZone from "../../../components/AdZone";
import NextTools from "../../../components/NextTools";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};
  const url = `${siteUrl}/tools/${tool.slug}`;
  return {
    title: tool.seoTitle,
    description: tool.description,
    robots: { index: toolIsIndexable(tool), follow: true },
    alternates: { canonical: url },
    openGraph: { title: tool.seoTitle, description: tool.description, url, type: "website", siteName: "ToolNest" },
    twitter: { card: "summary", title: tool.seoTitle, description: tool.description }
  };
}

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  const canIndex = toolIsIndexable(tool);
  const cat = categories.find((c) => c.category === tool.category);
  const related = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug && t.indexReady)
    .slice(0, 6);
  const url = `${siteUrl}/tools/${tool.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.name,
        url,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any (web browser)",
        description: tool.description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: tool.category, item: `${siteUrl}/category/${cat?.slug || ""}` },
          { "@type": "ListItem", position: 3, name: tool.name, item: url }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: (tool.faqs || []).map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a }
        }))
      }
    ]
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
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href={`/category/${cat?.slug || ""}`}>{tool.category}</Link> / {tool.name}</nav>
        <div className="eyebrow">{tool.category}</div>
        <h1>{tool.name}</h1>
        <p className="lead">{tool.description}</p>
        {!canIndex && <div className="notice" style={{ marginBottom: "18px" }}><strong>Not available yet.</strong> This tool is still being completed and may not work as described. Please do not rely on it for important work.</div>}
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_TOOL_TOP_SLOT} />
        <div className="tool-layout">
          <section className="panel" aria-label={`${tool.name} tool`}>
            <ToolClient tool={{ slug: tool.slug }} />
            <BugReport tool={tool.name} />
          </section>
          <aside className="panel">
            <h2>Before you use it</h2>
            <div className="notice small"><strong>Accuracy and privacy:</strong> Check the result and the tool’s stated limits before using it for important work. Avoid entering confidential information unless you are comfortable with how the tool handles it.</div>
            <h3 style={{ marginTop: "18px" }}>Related tools</h3>
            <div className="link-list">{related.map((item) => <Link href={`/tools/${item.slug}`} key={item.slug}>{item.name} →</Link>)}</div>
            {canIndex && <AdZone placement="sidebar" />}
          </aside>
        </div>
        {canIndex && <AdZone placement="result" />}
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_TOOL_BOTTOM_SLOT} />
        {canIndex && <NextTools current={tool} />}
        <article className="tool-copy">
          {tool.about && <section><h2>About {tool.name}</h2><p>{tool.about}</p></section>}
          <section><h2>How to use {tool.name}</h2>
            <ol>{(tool.howTo || []).map((step, i) => <li key={i}>{step}</li>)}</ol>
          </section>
          <section><h2>When to use this tool</h2><p>{tool.useCases || tool.description}</p></section>
          <section><h2>Limitations and accuracy</h2><p>{tool.limitations || "Review the output before using it for important work. Results depend on input quality and browser support."}</p></section>
          <section><h2>Frequently asked questions</h2>
            {(tool.faqs || []).map((faq, i) => <div className="faq" key={i}><h3>{faq.q}</h3><p>{faq.a}</p></div>)}
          </section>
          {related.length > 0 && <section><h2>More {tool.category} tools</h2><p>{related.map((r, i) => <span key={r.slug}>{i > 0 ? " · " : ""}<Link href={`/tools/${r.slug}`}>{r.name}</Link></span>)}</p></section>}
        </article>
        {canIndex && <AdZone placement="bottom" />}
        <footer className="footer"><div className="footer-nav"><Link href="/">All tools</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/disclaimer">Disclaimer</Link></div><p>ToolNest provides free general-purpose utilities. Always review results before relying on them.</p></footer>
      </main>
      {canIndex ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
    </>
  );
}
