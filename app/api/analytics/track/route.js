import { updateStore } from '../../../../lib/store';
import { rateLimit, rateLimitResponse, requestBodyTooLarge } from '../../../../lib/security';
export const runtime = 'nodejs';
export async function POST(request) {
  const rate = await rateLimit(request, { limit: 60, windowMs: 60_000, scope: 'analytics' }); if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
  if (requestBodyTooLarge(request, 4096)) return Response.json({ ok: false }, { status: 413 });
  try {
    const b = await request.json(); const type = ['page_view', 'tool_use'].includes(b.type) ? b.type : null;
    const page = String(b.path || '/').slice(0, 250);
    if (!type || !page.startsWith('/') || page.startsWith('//')) return Response.json({ ok: false }, { status: 400 });
    const day = new Date().toISOString().slice(0, 10); const visitor = String(b.visitor || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
    await updateStore(s => { s.events.unshift({ type, path: page, day, visitor, createdAt: new Date().toISOString() }); s.events = s.events.slice(0, 10000); });
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ ok: false }, { status: 500 }); }
}
