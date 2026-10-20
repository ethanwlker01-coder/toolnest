import { createSessionToken, SESSION_COOKIE } from '../../../../lib/admin';
import { rateLimit, rateLimitResponse, requestBodyTooLarge } from '../../../../lib/security';
export const runtime = 'nodejs';
export async function POST(request) {
  const rate = await rateLimit(request, { limit: 5, windowMs: 15 * 60_000, scope: "admin-login" });
  if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
  if (requestBodyTooLarge(request, 2048)) return Response.json({ error: "Request too large." }, { status: 413 });
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !process.env.ADMIN_SESSION_SECRET) return Response.json({ error: 'Admin login is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in .env.local.' }, { status: 503 });
  let body; try { body = await request.json(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  const given = Buffer.from(String(body.password || ''));
  const expected = Buffer.from(password);
  const crypto = await import('node:crypto');
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return Response.json({ error: 'Incorrect password.' }, { status: 401 });
  const token = createSessionToken();
  const response = Response.json({ ok: true });
  response.headers.append('Set-Cookie', `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
  return response;
}
