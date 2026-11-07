// Single source of truth for the site origin and indexing switch.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://toolnest-lyart.vercel.app"
).replace(/\/+$/, "");

// Tools marked indexReady are indexed by default.
// Set INDEX_TOOLS=false in the hosting dashboard to switch indexing off.
export const indexingEnabled = process.env.INDEX_TOOLS !== "false";

export const toolIsIndexable = (tool) => Boolean(tool.indexReady && indexingEnabled);

// Bump this only when content really changes (used in sitemap lastmod).
export const CONTENT_UPDATED = new Date("2026-11-07T00:00:00Z");
