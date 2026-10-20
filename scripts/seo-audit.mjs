import { readFileSync } from "node:fs";
const tools=JSON.parse(readFileSync("lib/tools.json","utf8"));
const categories=JSON.parse(readFileSync("lib/categories.json","utf8"));
const errors=[]; const slugs=new Set(); const titles=new Set();
for(const t of tools){
  if(slugs.has(t.slug)) errors.push(`Duplicate slug: ${t.slug}`); slugs.add(t.slug);
  if(!t.seoTitle||t.seoTitle.length>52) errors.push(`Missing/long SEO title: ${t.slug}`);
  if(!t.description||t.description.length>160) errors.push(`Missing/long meta description: ${t.slug}`);
  if(titles.has(t.seoTitle)) errors.push(`Duplicate SEO title: ${t.seoTitle}`); titles.add(t.seoTitle);
  if(!t.keyword||!t.relatedKeywords) errors.push(`Missing keyword map: ${t.slug}`);
  if(!Array.isArray(t.howTo)||t.howTo.length!==3) errors.push(`Missing tool instructions: ${t.slug}`);
  if(!Array.isArray(t.faqs)||t.faqs.length!==3) errors.push(`Missing FAQ entries: ${t.slug}`);
  if(typeof t.indexReady!=="boolean") errors.push(`Missing indexReady flag: ${t.slug}`);
}
for(const c of categories) if(!tools.some(t=>t.category===c.category)) errors.push(`Empty category: ${c.slug}`);
console.log(`SEO audit: ${tools.length} unique tool routes, ${categories.length} categories, ${tools.filter(t=>t.indexReady).length} index candidates, ${tools.filter(t=>!t.indexReady).length} noindex routes.`);
if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log("SEO metadata/content structure checks passed. This is not a keyword-volume audit or a browser QA/build test.");
