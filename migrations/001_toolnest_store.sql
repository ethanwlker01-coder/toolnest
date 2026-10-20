-- ToolNest persistent state and cross-instance rate limiting.
CREATE TABLE IF NOT EXISTS toolnest_store (
  id smallint PRIMARY KEY CHECK (id = 1),
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO toolnest_store (id, payload)
VALUES (1, '{"reports": [], "events": [], "usage": []}'::jsonb)
ON CONFLICT (id) DO NOTHING;
CREATE TABLE IF NOT EXISTS toolnest_rate_limits (
  bucket_key text PRIMARY KEY,
  count integer NOT NULL CHECK (count >= 0),
  reset_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS toolnest_rate_limits_reset_at_idx ON toolnest_rate_limits (reset_at);
