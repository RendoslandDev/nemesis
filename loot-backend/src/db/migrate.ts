import { query } from "../config/db";

const migrations = [

  `CREATE TABLE IF NOT EXISTS subscribers (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT NOT NULL UNIQUE,
    name        TEXT,
    status      TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'active', 'unsubscribed', 'bounced')),
    source      TEXT DEFAULT 'website',
    confirmed_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    confirm_token TEXT UNIQUE,
    unsubscribe_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email)`,
  `CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status)`,
  `CREATE INDEX IF NOT EXISTS idx_subscribers_confirm_token ON subscribers(confirm_token)`,

  `CREATE TABLE IF NOT EXISTS authors (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    bio         TEXT,
    twitter     TEXT,
    role        TEXT NOT NULL DEFAULT 'author'
                  CHECK (role IN ('author', 'admin')),
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,


  `CREATE TABLE IF NOT EXISTS issues (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number      INT NOT NULL UNIQUE,
    slug        TEXT NOT NULL UNIQUE,
    title       TEXT NOT NULL,
    excerpt     TEXT NOT NULL,
    content     JSONB NOT NULL DEFAULT '[]',
    tags        TEXT[] NOT NULL DEFAULT '{}',
    read_time   TEXT NOT NULL DEFAULT '5 min',
    status      TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'scheduled', 'published')),
    featured    BOOLEAN NOT NULL DEFAULT false,
    author_id   UUID NOT NULL REFERENCES authors(id) ON DELETE RESTRICT,
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    sent_at     TIMESTAMPTZ,
    sent_count  INT NOT NULL DEFAULT 0,
    open_count  INT NOT NULL DEFAULT 0,
    click_count INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status)`,
  `CREATE INDEX IF NOT EXISTS idx_issues_slug ON issues(slug)`,
  `CREATE INDEX IF NOT EXISTS idx_issues_published_at ON issues(published_at DESC)`,


  `CREATE TABLE IF NOT EXISTS email_sends (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id      UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
    status        TEXT NOT NULL DEFAULT 'queued'
                    CHECK (status IN ('queued','sent','failed','opened','clicked')),
    opened_at     TIMESTAMPTZ,
    clicked_at    TIMESTAMPTZ,
    error         TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE INDEX IF NOT EXISTS idx_email_sends_issue ON email_sends(issue_id)`,
  `CREATE INDEX IF NOT EXISTS idx_email_sends_subscriber ON email_sends(subscriber_id)`,

  `CREATE OR REPLACE FUNCTION update_updated_at()
   RETURNS TRIGGER AS $$
   BEGIN NEW.updated_at = now(); RETURN NEW; END;
   $$ LANGUAGE plpgsql`,

  `DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_subscribers_updated_at') THEN
       CREATE TRIGGER trg_subscribers_updated_at
         BEFORE UPDATE ON subscribers
         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
     END IF;
   END $$`,

  `DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_issues_updated_at') THEN
       CREATE TRIGGER trg_issues_updated_at
         BEFORE UPDATE ON issues
         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
     END IF;
   END $$`,
];

async function migrate() {
  console.log("🗄  Running migrations...");
  for (const sql of migrations) {
    await query(sql);
  }
  console.log("✅ Migrations complete.");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
