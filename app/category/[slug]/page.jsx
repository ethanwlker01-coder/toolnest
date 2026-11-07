import Link from "next/link";
import { notFound } from "next/navigation";
import tools from "../../../lib/tools.json";
import categories from "../../../lib/categories.json";

import { siteUrl, toolIsIndexable } from "../../../lib/site";
export function generateStaticParams() { return categories.map(c => ({ slug: c.slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cat = categories.find(c=>c.slug===slug);
  if(!cat) return {};
  return { title:cat.title, description:cat.description, alternates:{canonical:`${siteUrl}/category/${cat.slug}`}, openGraph:{title:cat.title, description:cat.description, url:`${siteUrl}/category/${cat.slug}`, type:"website", siteName:"ToolNest"} };
}
export default async function CategoryPage({params}) {
  const {slug}=await params;
  const category=categories.find(c=>c.slug===slug);
  if(!category) notFound();
  const entries=tools.filter(t=>t.category===category.category);
  const crumbs={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:siteUrl},{"@type":"ListItem",position:2,name:category.name,item:`${siteUrl}/category/${category.slug}`}]};
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(crumbs)}} /><header className="site-header"><div className="header-inner"><Link className="brand" href="/">Tool<span>Nest</span></Link><nav className="header-links"><Link href="/">All tools</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link></nav></div></header>
    <main id="main" className="container">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / {category.name}</nav>
      <div className="eyebrow">Tool category</div><h1>{category.name}</h1><p className="lead">{category.description}</p>
      <p className="small muted">{entries.length} free tools in this category.</p>
      <div className="tool-grid">{entries.map(t=><Link className="tool-card" href={`/tools/${t.slug}`} key={t.slug}><span className="pill">{toolIsIndexable(t)?"Free":"Coming soon"}</span><h3>{t.name}</h3><p>{t.description}</p><strong>Open tool →</strong></Link>)}</div>
      <section className="tool-copy"><h2>How to choose a tool in this category</h2><p>Pick the tool that matches your task, check the supported inputs and output format, and read the limitations on its page before using the result for important work. File tools are best tested on a copy of your file first. Calculators work from the numbers you enter, so confirm the units and assumptions.</p><h2>Frequently asked questions</h2><div className="faq"><h3>Are these tools free?</h3><p>Yes. Every tool listed here is free to use and needs no signup.</p></div><div className="faq"><h3>Are my files uploaded?</h3><p>Tools that run in your browser process your input on your device. Each tool page states how it handles your data.</p></div></section>
      <footer className="footer"><Link href="/">Back to all tools</Link></footer>
    </main></>;
}
