# ToolNest — free browser-based tools

Next.js App Router project with 110 unique tool routes across 10 categories. Designed for an English-first India + global audience.

## Local development
1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SITE_URL` to the real deployed HTTPS origin; for local development, `http://localhost:3000` is acceptable.
3. Run `npm install`. The postinstall script copies the PDF.js worker into `public/`.
4. Run `npm run dev` and open `http://localhost:3000`.
5. Run `npm run lint` and `npm run build` before deployment.

## SEO configuration
- Each tool has a distinct title/description and canonical URL. Category pages link to their tools.
- `app/sitemap.js` emits the home, category, policy and `indexReady` tool URLs. `app/robots.js` points crawlers to that sitemap.
- `INDEX_TOOLS` defaults to disabled when unset. Set it to `true` only after the production build and browser QA pass; otherwise tool pages remain noindex and out of the sitemap.
- Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the Search Console HTML-tag token when verifying the site.
- Keyword Planner advertiser competition is not organic ranking difficulty. No search volume or ranking is guaranteed by this project.

## Limits
PDF-to-images, PDF text extraction, OCR, and live currency rates depend on browser worker/service availability and must be tested after installation. OCR is English-only. PDF optimization reports measured file size and does not promise compression. DOCX-to-PDF fidelity, AI models/APIs and platform downloaders are not falsely presented as complete; see `IMPLEMENTATION_STATUS.md`.

## Release checklist
- Confirm `toolnest.qd.je` resolves to the deployment and supports HTTPS before using it as the canonical origin.
- Test a representative sample from every tool category and all file operations.
- Review privacy policy to match actual processing and any external rate/OCR services.
- Keep unfinished routes out of the sitemap and noindex.
- Verify Search Console, submit `/sitemap.xml`, then monitor impressions/clicks before expanding content.


### Optional media-processing server requirements
The `/api/media-download` route requires `yt-dlp` and `ffmpeg` installed on the Node.js host and available on PATH. It accepts public supported-platform URLs only; private content, session cookies and DRM/access-control bypass are not supported. Local-file conversion is limited to 100 MB and 10 minutes. Confirm the deployment provider allows child processes and temporary-file storage before enabling this feature.

## Private owner dashboard, bug reports and basic analytics

- Copy the new `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` entries from `.env.example` into `.env.local`. Use a unique password and a different random secret (32+ characters). Never commit `.env.local`.
- Restart the dev server, then open `/owner-console-7x9` directly. The route is not linked from public navigation, is marked `noindex`, and requires the admin password. A hidden URL alone is not security; keep the password secret.
- Each tool page now has a small Report a bug form. Reports are saved with status, timestamp and optional reply email. The dashboard shows page views, unique browser IDs, tool-panel interactions and bug reports.
- Basic analytics are first-party and approximate. Tool use means a click on a control inside a tool panel, not proof that processing succeeded. Users can clear local storage or use another browser/device, so unique visitor counts are estimates.
- Current reports and analytics are stored in `data/toolnest-admin.json` on the server filesystem. This works for local development and persistent Node hosting. For serverless/multi-instance deployment, configure persistent shared storage (e.g. PostgreSQL/managed database) before launch, otherwise data may not persist across instances/deployments. Set rate limits / CAPTCHA at the hosting layer before public launch.
- Do not collect passwords, uploaded file contents, or sensitive information in bug reports. Keep the admin secret private.


## Production database
Set `DATABASE_URL` to a PostgreSQL database for production. Production intentionally refuses to fall back to the local JSON store. The store and rate-limit schema are initialized automatically. See `SECURITY_AND_FREE_LIMITS.md` for deployment checks.

Database schema reference: `migrations/001_toolnest_store.sql`. The application also runs idempotent schema initialization on first database access.

## Backup and production QA
- Run `bash scripts/backup-postgres.sh` from a trusted machine with PostgreSQL client tools installed to create a private database dump.
- Use `docs/PRODUCTION_QA_CHECKLIST.md` as the release gate. A passing syntax/SEO check is not a substitute for the production build or browser tests.
