import tools from "../lib/tools.json";
import categories from "../lib/categories.json";
import { siteUrl, indexingEnabled, toolIsIndexable, CONTENT_UPDATED } from "../lib/site";

export default function sitemap() {
  const lastModified = CONTENT_UPDATED;
  return [
    { url: siteUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    ...categories.map((c) => ({ url: `${siteUrl}/category/${c.slug}`, lastModified, changeFrequency: "monthly", priority: 0.7 })),
    { url: `${siteUrl}/about`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/disclaimer`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    ...(indexingEnabled
      ? tools.filter(toolIsIndexable).map((t) => ({ url: `${siteUrl}/tools/${t.slug}`, lastModified, changeFrequency: "monthly", priority: 0.65 }))
      : [])
  ];
}
