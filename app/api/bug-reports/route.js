import { updateStore } from '../../../lib/store';
import { rateLimit, rateLimitResponse, requestBodyTooLarge } from '../../../lib/security';
export const runtime = 'nodejs';
const clean = (v, n = 3000) => String(v || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n);
export async function POST(request) {
  const rate = await rateLimit(request, { limit: 5, windowMs: 10 * 60_000, scope: 'bug-report' }); if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
  if (requestBodyTooLarge(request, 10_000)) return Response.json({ error: 'Report is too large.' }, { status: 413 });
  try {
    const body = await request.json();
    const tool = clean(body.tool, 120), details = clean(body.details, 3000);
    if (!tool || details.length < 5) return Response.json({ error: 'Tool name and a useful error description are required.' }, { status: 400 });
    const issueType = clean(body.issueType, 80); const email = clean(body.email, 180);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: 'Enter a valid email or leave it blank.' }, { status: 400 });
    const id = `BUG-${Date.now().toString(36).toUpperCase()}`;
    await updateStore(s => { s.reports.unshift({ id, tool, issueType, details, email, status: 'Open', createdAt: new Date().toISOString() }); s.reports = s.reports.slice(0, 1000); });
    return Response.json({ ok: true, id }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Could not save report. Please try again.' }, { status: 500 }); }
}
