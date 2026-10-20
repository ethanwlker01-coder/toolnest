'use client';
import { useEffect } from 'react';
export default function AnalyticsTracker() {
  useEffect(() => {
    let visitor = ''; try { visitor = localStorage.getItem('tn_visitor_id') || ''; if (!visitor) { visitor = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`; localStorage.setItem('tn_visitor_id', visitor); } } catch {}
    const send = (type, path) => { try { fetch('/api/analytics/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, path, visitor }), keepalive: true }); } catch {} };
    send('page_view', window.location.pathname);
    if (window.location.pathname.startsWith('/tools/')) {
      let sent = false;
      const onUse = e => { if (sent || !e.target.closest('.tool-layout .panel')) return; if (!e.target.closest('button,input,textarea,select,[role="button"]')) return; sent = true; send('tool_use', window.location.pathname); document.removeEventListener('click', onUse, true); };
      document.addEventListener('click', onUse, true);
      return () => document.removeEventListener('click', onUse, true);
    }
  }, []);
  return null;
}
