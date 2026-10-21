
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";

const dir = path.join(process.cwd(), "data");
const file = path.join(dir, "toolnest-admin.json");
const blank = { reports: [], events: [], usage: [] };

let writeQueue = Promise.resolve();
let poolPromise;
let schemaPromise;
let lastRateCleanup = 0;

async function getPool() {
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "DATABASE_URL is required in production. Configure PostgreSQL before enabling persistent admin, analytics, reports or usage limits."
      );
    }
    return null;
  }

  if (!poolPromise) {
    poolPromise = import("pg").then(({ Pool }) =>
      new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl:
          process.env.PGSSLMODE === "require" ||
          process.env.DATABASE_SSL === "true"
            ? {
                rejectUnauthorized:
                  process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
              }
            : undefined,
        max: Number(process.env.PG_POOL_MAX || 5),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 8000,
      })
    );
  }

  const pool = await poolPromise;

  if (!schemaPromise) {
    schemaPromise = pool
      .query(`
        CREATE TABLE IF NOT EXISTS toolnest_store (
          id smallint PRIMARY KEY CHECK (id = 1),
          payload jsonb NOT NULL,
          updated_at timestamptz NOT NULL DEFAULT now()
        );

        INSERT INTO toolnest_store (id, payload)
        VALUES (1, '{"reports":[],"events":[],"usage":[]}'::jsonb)
        ON CONFLICT (id) DO NOTHING;

        CREATE TABLE IF NOT EXISTS toolnest_rate_limits (
          bucket_key text PRIMARY KEY,
          count integer NOT NULL,
          reset_at timestamptz NOT NULL
        );
      `)
      .catch((error) => {
        schemaPromise = null;
        throw error;
      });
  }

  await schemaPromise;
  return pool;
}

function normalize(parsed) {
  return {
    ...blank,
    ...parsed,
    reports: Array.isArray(parsed.reports)
      ? parsed.reports.slice(0, 1000)
      : [],
    events: Array.isArray(parsed.events)
      ? parsed.events.slice(0, 10000)
      : [],
    usage: Array.isArray(parsed.usage)
      ? parsed.usage.slice(0, 100000)
      : [],
  };
}

export async function readStore() {
  const pool = await getPool();

  if (pool) {
    const { rows } = await pool.query(
      "SELECT payload FROM toolnest_store WHERE id = 1"
    );

    return normalize(rows[0]?.payload || blank);
  }

  try {
    return normalize(JSON.parse(await readFile(file, "utf8")));
  } catch (error) {
    if (
      error?.code !== "ENOENT" &&
      !(error instanceof SyntaxError)
    ) {
      throw error;
    }

    return structuredClone(blank);
  }
}

export async function updateStore(mutator) {
  const pool = await getPool();

  if (pool) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      await client.query("SELECT pg_advisory_xact_lock(78214591)");

      const { rows } = await client.query(
        "SELECT payload FROM toolnest_store WHERE id = 1 FOR UPDATE"
      );

      const store = normalize(rows[0]?.payload || blank);
      const result = await mutator(store);

      store.reports = (store.reports || []).slice(0, 1000);
      store.events = (store.events || []).slice(0, 10000);
      store.usage = (store.usage || []).slice(0, 100000);

      await client.query(
        "UPDATE toolnest_store SET payload = $1::jsonb, updated_at = now() WHERE id = 1",
        [JSON.stringify(store)]
      );

      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  let resolveResult;
  let rejectResult;

  const resultPromise = new Promise((resolve, reject) => {
    resolveResult = resolve;
    rejectResult = reject;
  });

  writeQueue = writeQueue.then(async () => {
    try {
      await mkdir(dir, { recursive: true });

      const store = await readStore();
      const result = await mutator(store);

      store.reports = (store.reports || []).slice(0, 1000);
      store.events = (store.events || []).slice(0, 10000);
      store.usage = (store.usage || []).slice(0, 100000);

      const temp = `${file}.${process.pid}.tmp`;

      await writeFile(temp, JSON.stringify(store), {
        mode: 0o600,
      });

      await rename(temp, file);
      resolveResult(result);
    } catch (error) {
      rejectResult(error);
    }
  });

  return resultPromise;
}

export async function sharedRateLimit(key, limit, windowMs) {
  const pool = await getPool();

  if (!pool) return null;

  if (Date.now() - lastRateCleanup > 60000) {
    lastRateCleanup = Date.now();

    await pool
      .query(
        "DELETE FROM toolnest_rate_limits WHERE reset_at < now() - interval '1 hour'"
      )
      .catch(() => {});
  }

  const { rows } = await pool.query(
    `
      INSERT INTO toolnest_rate_limits (
        bucket_key,
        count,
        reset_at
      )
      VALUES (
        $1,
        1,
        now() + ($2 * interval '1 millisecond')
      )
      ON CONFLICT (bucket_key)
      DO UPDATE SET
        count = CASE
          WHEN toolnest_rate_limits.reset_at <= now() THEN 1
          ELSE toolnest_rate_limits.count + 1
        END,
        reset_at = CASE
          WHEN toolnest_rate_limits.reset_at <= now()
            THEN now() + ($2 * interval '1 millisecond')
          ELSE toolnest_rate_limits.reset_at
        END
      RETURNING
        count,
        GREATEST(
          1,
          CEIL(EXTRACT(EPOCH FROM (reset_at - now())))
        )::int AS retry_after
    `,
    [key, windowMs]
  );

  return {
    allowed: rows[0].count <= limit,
    retryAfter: rows[0].retry_after,
  };
}
