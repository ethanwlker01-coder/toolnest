import crypto from 'node:crypto';

const COOKIE_NAME = 'tn_owner_session';
function secret() { return process.env.ADMIN_SESSION_SECRET || ''; }
export function createSessionToken() {
  const key = secret();
  if (!key) throw new Error('ADMIN_SESSION_SECRET is not configured');
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 1000 * 60 * 60 * 12 })).toString('base64url');
  const sig = crypto.createHmac('sha256', key).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}
export function validSession(request) {
  const key = secret();
  if (!key) return false;
  const token = request.cookies.get(COOKIE_NAME)?.value || '';
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = crypto.createHmac('sha256', key).update(payload).digest();
  let actual;
  try { actual = Buffer.from(sig, 'base64url'); } catch { return false; }
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now(); } catch { return false; }
}
export const SESSION_COOKIE = COOKIE_NAME;
