import Link from "next/link";
import { notFound } from "next/navigation";
import tools from "../../../lib/tools.json";
import categories from "../../../lib/categories.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://toolnest.qd.je";
export function generateStaticParams() { return categories.map(c => ({ slug: c.slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cat = categories.find(c=>c.slug===slug);
  if(!cat) return {};
  return { title:cat.title, description:cat.description, alternates:{canonical:`${siteUrl}/category/${cat.slug}`} };
}
export default async function CategoryPage({params}) {
  const {slug}=await params;
  const category=categories.find(c=>c.slug===slug);
  if(!category) notFound();
  const entries=tools.filter(t=>t.category===category.category);
  return <><header className="site-header"><div className="header-inner"><Link className="brand" href="/">Tool<span>Nest</span></Link><nav className="header-links"><Link href="/">All tools</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link></nav></div></header>
    <main id="main" className="container">
      <div className="breadcrumbs"><Link href="/">Home</Link> / {category.name}</div>
      <div className="eyebrow">Tool category</div><h1>{category.name}</h1><p className="lead">{category.description}</p>
      <p className="small muted">{entries.length} tools are listed in this category. In production, index only the tools that are complete, tested and genuinely helpful.</p>
      <div className="tool-grid">{entries.map(t=><Link className="tool-card" href={`/tools/${t.slug}`} key={t.slug}><span className="pill">{t.indexReady?"Ready for review":"Needs QA / integration"}</span><h3>{t.name}</h3><p>{t.description}</p><strong>Open tool →</strong></Link>)}</div>
      <section className="tool-copy"><h2>How to choose a tool in this category</h2><p>Choose the tool that matches the actual task, verify the assumptions and output format, and check the limitations before using the result for important work. File converters should be tested against different source files and browsers. Calculators should state their units and formulas. Developer tools should make it clear whether they process input locally and whether the output is validated or merely transformed.</p><h2>Frequently asked questions</h2><div className="faq"><h3>Are all tools ready for production?</h3><p>No. The launch-ready flag in the research metadata is a review aid, not a substitute for functional, security, accessibility and SEO testing.</p></div><div className="faq"><h3>Does every page need to be indexed?</h3><p>No. Pages that are unfinished, duplicated or not useful should remain out of the sitemap and should not be promoted for organic search until the issue is fixed.</p></div></section>
      <footer className="footer"><Link href="/">Back to all tools</Link></footer>
    </main></>;
}
