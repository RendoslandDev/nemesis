import bcrypt from "bcryptjs";
import { query } from "../config/db";

async function seed() {
  console.log("🌱 Seeding database...");

  // Admin author
  const hash = await bcrypt.hash("devletter123", 12);
  const { rows: [author] } = await query<{ id: string }>(
    `INSERT INTO authors (name, email, password_hash, bio, twitter, role)
     VALUES ($1,$2,$3,$4,$5,'admin')
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    ["Alex Mercer", "alex@devletter.io", hash, "Editor-in-chief. 10 years building software products.", "@alexmercer_dev"]
  );

  // Sample issue
  const content = [
    { type: "intro", text: "Every January I do a purge. I go through every app, extension, and subscription and ask: did this actually make me better?" },
    { type: "h2", text: "The survivors from the AI wave" },
    { type: "p", text: "Cursor is the honest answer. Not because it's the most impressive demo, but because it integrates without demanding a new mental model." },
    { type: "code", language: "bash", text: "cursor . --new-window" },
    { type: "quote", text: "The best tool is the one you stop thinking about." },
  ];

  await query(
    `INSERT INTO issues (number, slug, title, excerpt, content, tags, read_time, status, featured, author_id, published_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,'published',true,$8,now())
     ON CONFLICT (number) DO NOTHING`,
    [
      47,
      "tools-that-survived-2024",
      "The tools that survived 2024 — and why we're still using them",
      "From AI coding assistants to content pipelines: a candid look at what actually stuck.",
      JSON.stringify(content),
      ["tools", "AI", "workflow"],
      "8 min",
      author.id,
    ]
  );

  // Sample subscribers
  const emails = ["demo@example.com", "test@devletter.io"];
  for (const email of emails) {
    await query(
      `INSERT INTO subscribers (email, status, confirmed_at, source)
       VALUES ($1,'active',now(),'seed')
       ON CONFLICT (email) DO NOTHING`,
      [email]
    );
  }

  console.log("✅ Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
