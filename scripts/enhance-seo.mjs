// One-off: rewrites generic SEO fields in lib/tools.json. Safe to re-run.
import { readFileSync, writeFileSync } from "node:fs";
const tools = JSON.parse(readFileSync("lib/tools.json", "utf8"));
const cats = JSON.parse(readFileSync("lib/categories.json", "utf8"));

const extra = {
  "exif-remover": "Photos taken on a phone or camera often carry hidden EXIF metadata: the device model, date and time, and sometimes GPS coordinates. Sharing the original file can reveal where a picture was taken. This tool re-saves your image without that metadata so you can post or send it more safely. Open the result and compare it with the original; image quality may change slightly because the file is re-encoded.",
  "remove-duplicate-lines": "Duplicate lines creep into email lists, keyword lists, log files and exported data. Paste your text, remove repeated lines and keep one copy of each. This is useful when cleaning keyword research, merging lists from several sources, or tidying a file before importing it. Check whether you need case-sensitive matching, because 'Apple' and 'apple' may or may not count as the same line.",
  "json-to-markdown-table": "Documentation, README files and GitHub issues often need data shown as a table. Paste a JSON array of objects and get a Markdown table with one column per key. It saves manual formatting when documenting API responses or comparing records. Nested objects and arrays do not map cleanly to table cells, so flatten deeply nested data first.",
  "hreflang-generator": "hreflang tags tell Google which language or regional version of a page to show to which audience, for example an English page and a Hindi page. Enter language=URL pairs and the tool outputs the link tags to paste into the head of each page. Every page in the set should list all versions, including itself, and the URLs must be complete and accessible. Always check the final tags with a crawler or Search Console.",
  "ads-txt-generator": "An ads.txt file is a public text file at the root of your domain that lists which companies are authorized to sell your ad inventory. Enter the ad system domain, your publisher ID and the relationship (DIRECT or RESELLER) to generate a correct line. Copy the exact values from your ad network's dashboard, because a wrong ID can block ad revenue. Upload the file to /ads.txt on your domain and confirm it loads in the browser."
};

const small = new Set(["a","an","the","of","to","in","and","or","for"]);
const lowerName = (t) => t.name.toLowerCase();
const fixName = (s, t) => typeof s !== "string" ? s :
  lowerName(t) === t.name ? s :
  s.replace(new RegExp(`(?<![A-Za-z])${lowerName(t).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?![A-Za-z])`, "g"), t.name);

for (const t of tools) {
  t.howTo = t.howTo.map(s => fixName(s, t));
  t.useCases = fixName(t.useCases, t);
  t.limitations = fixName(t.limitations, t);
  if (!t.indexReady) continue; // noindex pages keep their notices

  const local = t.processingModel === "Client-side";
  // Title (root layout appends " | ToolNest")
  const cleanName = t.name.replace(/\s*\(.*?\)/g, "");
  const base = /online|calculator|generator|converter|checker|builder|test|timer|game/i.test(t.name) && !/\bPDF\b|Image|Video/i.test(t.name) ? cleanName : `${cleanName} Online`;
  const suffixes = local ? ["Free, in Your Browser","Free & Private","Free"] : ["Free & Instant","Free"];
  t.seoTitle = suffixes.map(s => `${base} – ${s}`).find(x => x.length <= 50) || `${base} – Free`;

  // Description: unique second sentence + value statement
  const sentences = t.description.split(/(?<=\.)\s+/).filter(s => !/^Use this free/i.test(s) && !/^Review the output/i.test(s));
  const rel = t.relatedKeywords.split(",").map(x => x.trim()).filter(Boolean).slice(0,2);
  let desc;
  if (sentences[0] && sentences[0].length > 25) {
    desc = `${fixName(sentences[0], t).replace(/\.$/, "")}.${local ? " Free, no signup, runs in your browser." : " Free, no signup."}`;
  } else {
    desc = `Free ${t.keyword}${rel.length ? ` – ${rel.join(", ")} and more` : ""}. No signup${local ? ", runs in your browser" : ""}.`;
  }
  if (desc.length > 160) desc = desc.slice(0, 157).replace(/\s+\S*$/, "") + "…";
  t.description = desc;

  // FAQs: specific, not boilerplate
  const related = tools.filter(x => x.category === t.category && x.slug !== t.slug && x.indexReady).slice(0,3).map(x => x.name);
  t.faqs = [
    { q: `Is ${t.name} free to use?`, a: `Yes. ${t.name} on ToolNest is free and needs no account or signup.` },
    { q: `Is my data sent to a server when I use ${t.name}?`, a: local
        ? `This tool processes your input in your browser, so the content is not uploaded to ToolNest servers for the main operation. Closing the tab clears it from the page.`
        : `Most of the work happens in your browser, but some features may use a browser library or an external service. Read the limitations section on this page before using sensitive data.` },
    { q: `How do I use ${t.name}?`, a: t.howTo.join(" ") },
    { q: `What are the limitations of ${t.name}?`, a: t.limitations },
    { q: `Which related tools can I use with ${t.name}?`, a: related.length ? `You can also try ${related.join(", ")} from the same category.` : `Browse the full tool list on the ToolNest home page.` }
  ];
  if (extra[t.slug]) t.about = extra[t.slug];
}
writeFileSync("lib/tools.json", JSON.stringify(tools, null, 2) + "\n");
console.log("updated", tools.length);
