import Link from "next/link";
import tools from "../lib/tools.json";
import { toolIsIndexable } from "../lib/site";

// "Try next" block: more pageviews per visit and better internal linking.
export default function NextTools({ current }) {
  const pool = tools.filter((t) => toolIsIndexable(t) && t.slug !== current.slug && t.category !== current.category);
  if (!pool.length) return null;
  let h = 0;
  for (const ch of current.slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const picks = Array.from({ length: Math.min(4, pool.length) }, (_, i) => pool[(h + i * 7) % pool.length]);
  const unique = [...new Map(picks.map((t) => [t.slug, t])).values()];
  return (
    <section className="panel" aria-label="Try another tool" style={{ marginTop: 18 }}>
      <h2 style={{ marginTop: 0 }}>Try another free tool</h2>
      <div className="tool-grid">
        {unique.map((t) => (
          <Link className="tool-card" href={`/tools/${t.slug}`} key={t.slug}>
            <span className="pill">{t.category}</span>
            <h3>{t.name}</h3>
            <strong>Open tool →</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
