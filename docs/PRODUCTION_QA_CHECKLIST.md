# ToolNest production QA checklist

## Automated checks
- [ ] `npm install` completes on the target Node.js version. (This project currently has no committed lockfile, so lockfile generation and dependency versions should be pinned as a separate release step.)
- [ ] `npm run lint` passes.
- [ ] `npm run audit:seo` passes.
- [ ] `npm run build` passes with production-like environment variables.
- [ ] `DATABASE_URL` points to the production PostgreSQL database over TLS.
- [ ] `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, and `USAGE_SIGNING_SECRET` are unique secrets of at least 32 characters (password may be longer and high entropy).

## Manual browser tests
- [ ] Homepage, all 10 categories, search, legal pages, and all 110 tool routes load without console errors.
- [ ] Each indexable tool is tested with valid input, invalid input, empty input, and a boundary case.
- [ ] Every file tool is tested with a valid sample, wrong file type, oversized file, corrupted file, and multi-file edge case where applicable.
- [ ] Word-to-PDF is checked with English, Hindi/Devanagari, mixed-language text, long paragraphs, and multiple pages. Confirm it is text-only conversion and not layout-preserving.
- [ ] PDF tools are tested with password-protected, malformed, large, rotated, and multi-page PDFs where applicable.
- [ ] A failed operation does not consume the daily free quota; successful operations do; the fourth success is blocked.
- [ ] Quota and rate limits work across two browser sessions / two app instances.
- [ ] Admin login rejects bad passwords, throttles repeated attempts, and admin APIs return 401 without a valid session.
- [ ] Bug reports validate fields and appear only in the authenticated owner dashboard.
- [ ] Analytics and usage endpoints return no-store headers and reject malformed payloads.
- [ ] Ad slots stay hidden until approved publisher/client and real slot IDs are configured. Verify ads do not overlap controls or violate layout requirements.
- [ ] `robots.txt`, `sitemap.xml`, canonical URLs, metadata, noindex flags, redirects, and 404 pages are checked on the deployed domain.
- [ ] Backup and restore are tested against a staging database before launch.
- [ ] Verify CSP in browser console with AdSense disabled and then enabled; adapt provider domains only as needed, without broadly disabling CSP.

## External steps code cannot complete
- Provision the database and set production environment variables in the hosting dashboard.
- Configure DNS/domain ownership, HTTPS, trusted proxy IP headers, host-level request limits and media binaries if used.
- Configure provider-managed backups/retention and test restore.
- Verify ownership in Google Search Console and submit sitemap.
- Apply for AdSense, complete publisher/payment/tax steps, and wait for site approval before enabling ads.
