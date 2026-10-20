'use client';
import { useState } from 'react';
export default function BugReport({ tool }) {
  const [open, setOpen] = useState(false), [issueType, setIssueType] = useState('Error message'), [details, setDetails] = useState(''), [email, setEmail] = useState(''), [state, setState] = useState('idle'), [message, setMessage] = useState('');
  async function submit(e) {
    e.preventDefault(); setState('sending'); setMessage('');
    try { const r = await fetch('/api/bug-reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool, issueType, details, email }) }); const data = await r.json(); if (!r.ok) throw new Error(data.error || 'Could not send report'); setState('sent'); setMessage(`Report submitted (${data.id}). Thank you!`); setDetails(''); setEmail(''); }
    catch (err) { setState('error'); setMessage(err.message || 'Please try again.'); }
  }
  return <section className="bug-report" aria-label="Report a bug"><button type="button" className="bug-report-toggle" onClick={() => setOpen(!open)}>{open ? '− Close bug report' : '🐛 Report a bug'}</button>{open && <form className="bug-report-form" onSubmit={submit}><h3>Something not working?</h3><p>Tell us which tool failed and paste the error message. Don’t include passwords or private documents.</p><label>Issue type<select value={issueType} onChange={e => setIssueType(e.target.value)}><option>Error message</option><option>Tool not working</option><option>Wrong result</option><option>Other issue</option></select></label><label>Error message / details<textarea required minLength={5} maxLength={3000} rows={4} value={details} onChange={e => setDetails(e.target.value)} placeholder="Paste the error message and explain what you were doing…" /></label><label>Email (optional)<input type="email" maxLength={180} value={email} onChange={e => setEmail(e.target.value)} placeholder="For a reply, if needed" /></label><button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Submit report'}</button>{message && <p role="status" className={state === 'error' ? 'bug-error' : 'bug-success'}>{message}</p>}</form>}</section>;
}
