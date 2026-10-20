import Link from "next/link";
import tools from "../../lib/tools.json";

export const metadata = { title: "Search Tools", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = (params?.q || "").toLowerCase().trim();
  const results = tools.filter(t => !q || `${t.name} ${t.category} ${t.keyword} ${t.relatedKeywords}`.toLowerCase().includes(q));
  return (
    <><header className="site-header"><div className="header-inner"><Link className="brand" href="/">Tool<span>Nest</span></Link><Link href="/">All tools</Link></div></header>
    <main id="main" className="container">
      <div className="breadcrumbs"><Link href="/">Home</Link> / Search</div>
      <h1>Search tools</h1><p className="lead">{results.length} results for “{q || "all tools"}”.</p>
      <div className="tool-grid">{results.map(t=><Link className="tool-card" href={`/tools/${t.slug}`} key={t.slug}><span className="pill">{t.category}</span><h3>{t.name}</h3><p>{t.description}</p><strong>Open tool →</strong></Link>)}</div>
      <p className="footer"><Link href="/">Back to all tools</Link></p>
    </main></>
  );
}
