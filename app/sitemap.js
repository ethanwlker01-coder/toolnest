import tools from "../lib/tools.json";
import categories from "../lib/categories.json";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://toolnest-lyart.vercel.app").replace(/\/+$/, "");
export default function sitemap() {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...categories.map(c => ({ url: `${siteUrl}/category/${c.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 })),
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ...(process.env.INDEX_TOOLS === "true" ? tools.filter(t => t.indexReady).map(t => ({ url: `${siteUrl}/tools/${t.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.65 })) : [])
  ];
}
