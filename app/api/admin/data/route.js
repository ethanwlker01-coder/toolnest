import { validSession } from '../../../../lib/admin';
import { requestBodyTooLarge } from '../../../../lib/security';
import { readStore, updateStore } from '../../../../lib/store';
export const runtime = 'nodejs';
export async function GET(request) {
  if (!validSession(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const s = await readStore();
  const events = s.events;
  const today = new Date().toISOString().slice(0, 10);
  const pageViews = events.filter(e => e.type === 'page_view');
  const toolUses = events.filter(e => e.type === 'tool_use');
  const uniqueVisitors = new Set(pageViews.filter(e => e.visitor).map(e => e.visitor)).size;
  const todayUniqueVisitors = new Set(pageViews.filter(e => e.day === today && e.visitor).map(e => e.visitor)).size;
  const todayUsage = s.usage.filter(row => row.day === today);
  const freeUsesToday = todayUsage.reduce((sum, row) => sum + Number(row.count || 0), 0);
  const browsersUsingToday = todayUsage.length;
  const byTool = {};
  for (const e of toolUses) byTool[e.path] = (byTool[e.path] || 0) + 1;
  return Response.json({ stats: { pageViews: pageViews.length, todayViews: pageViews.filter(e => e.day === today).length, uniqueVisitors, todayUniqueVisitors, toolUses: toolUses.length, reportsOpen: s.reports.filter(r => r.status !== 'Fixed').length, freeUsesToday, browsersUsingToday, freeLimitPerBrowser: 3 }, byTool: Object.entries(byTool).sort((a,b) => b[1]-a[1]).slice(0, 20), reports: s.reports.slice(0, 300), recentEvents: events.slice(0, 100) }, { headers: { 'Cache-Control': 'no-store', 'Pragma': 'no-cache' } });
}
export async function PATCH(request) {
  if (requestBodyTooLarge(request, 2048)) return Response.json({ error: 'Request too large' }, { status: 413, headers: { 'Cache-Control': 'no-store' } });
  if (!validSession(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id, status } = await request.json();
    if (!['Open', 'In Progress', 'Fixed'].includes(status)) return Response.json({ error: 'Invalid status' }, { status: 400 });
    const found = await updateStore(s => { const report = s.reports.find(r => r.id === id); if (report) report.status = status; return Boolean(report); });
    return found ? Response.json({ ok: true }) : Response.json({ error: 'Report not found' }, { status: 404 });
  } catch { return Response.json({ error: 'Update failed' }, { status: 500 }); }
}
