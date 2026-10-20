#!/usr/bin/env bash
set -euo pipefail
: "${DATABASE_URL:?Set DATABASE_URL to the PostgreSQL connection string}"
command -v pg_dump >/dev/null 2>&1 || { echo "pg_dump is required. Install PostgreSQL client tools." >&2; exit 1; }
out_dir="${1:-backups}"
mkdir -p "$out_dir"
file="$out_dir/toolnest-$(date -u +%Y%m%dT%H%M%SZ).dump"
pg_dump --format=custom --no-owner --no-privileges "$DATABASE_URL" --file "$file"
chmod 600 "$file"
echo "Backup written: $file"
echo "Store this file outside the web root and test restore periodically."
