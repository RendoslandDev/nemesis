import { query } from "../config/db";
import slugify from "slugify";

export interface Issue {
  id: string;
  number: number;
  slug: string;
  title: string;
  excerpt: string;
  content: any[];
  tags: string[];
  read_time: string;
  status: "draft" | "scheduled" | "published";
  featured: boolean;
  author_id: string;
  published_at?: Date;
  scheduled_at?: Date;
  sent_at?: Date;
  sent_count: number;
  open_count: number;
  click_count: number;
  created_at: Date;
  updated_at: Date;
  // joined
  author_name?: string;
  author_email?: string;
}

export interface CreateIssueInput {
  title: string;
  excerpt: string;
  content?: any[];
  tags?: string[];
  read_time?: string;
  featured?: boolean;
  author_id: string;
  status?: "draft" | "scheduled" | "published";
  scheduled_at?: Date;
}

export const issueService = {
  async create(input: CreateIssueInput): Promise<Issue> {
    // Auto-increment issue number
    const { rows: [{ max }] } = await query<{ max: string }>("SELECT COALESCE(MAX(number),0) as max FROM issues");
    const number = parseInt(max) + 1;
    const slug = slugify(input.title, { lower: true, strict: true });

    const { rows } = await query<Issue>(
      `INSERT INTO issues
         (number, slug, title, excerpt, content, tags, read_time, featured, author_id, status, scheduled_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        number, slug, input.title, input.excerpt,
        JSON.stringify(input.content ?? []),
        input.tags ?? [],
        input.read_time ?? "5 min",
        input.featured ?? false,
        input.author_id,
        input.status ?? "draft",
        input.scheduled_at ?? null,
      ]
    );
    return rows[0];
  },

  async update(id: string, updates: Partial<CreateIssueInput>): Promise<Issue | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowed = ["title","excerpt","content","tags","read_time","featured","status","scheduled_at"] as const;
    for (const key of allowed) {
      if (key in updates) {
        const val = key === "content" ? JSON.stringify(updates[key]) : (updates as any)[key];
        fields.push(`${key} = $${idx++}`);
        values.push(val);
      }
    }

    if (fields.length === 0) return null;

    // Auto-publish
    if (updates.status === "published") {
      fields.push(`published_at = COALESCE(published_at, now())`);
    }

    values.push(id);
    const { rows } = await query<Issue>(
      `UPDATE issues SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] ?? null;
  },

  async findById(id: string): Promise<Issue | null> {
    const { rows } = await query<Issue>(
      `SELECT i.*, a.name as author_name, a.email as author_email
       FROM issues i JOIN authors a ON a.id = i.author_id
       WHERE i.id = $1`,
      [id]
    );
    return rows[0] ?? null;
  },

  async findBySlug(slug: string): Promise<Issue | null> {
    const { rows } = await query<Issue>(
      `SELECT i.*, a.name as author_name, a.email as author_email
       FROM issues i JOIN authors a ON a.id = i.author_id
       WHERE i.slug = $1 AND i.status = 'published'`,
      [slug]
    );
    return rows[0] ?? null;
  },

  async list(status?: string, limit = 20, offset = 0): Promise<{ issues: Issue[]; total: number }> {
    const where = status ? "WHERE i.status = $3" : "";
    const params: any[] = [limit, offset, ...(status ? [status] : [])];
    const [{ rows: issues }, { rows: [{ count }] }] = await Promise.all([
      query<Issue>(
        `SELECT i.*, a.name as author_name FROM issues i
         JOIN authors a ON a.id = i.author_id
         ${where} ORDER BY i.created_at DESC LIMIT $1 OFFSET $2`,
        params
      ),
      query<{ count: string }>(
        `SELECT COUNT(*) FROM issues i ${status ? "WHERE i.status = $1" : ""}`,
        status ? [status] : []
      ),
    ]);
    return { issues, total: parseInt(count) };
  },

  async getPublished(limit = 20, offset = 0): Promise<{ issues: Issue[]; total: number }> {
    return this.list("published", limit, offset);
  },

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await query("DELETE FROM issues WHERE id = $1", [id]);
    return (rowCount ?? 0) > 0;
  },
};
