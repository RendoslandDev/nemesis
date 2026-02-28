import { query } from "../config/db";
import { randomUUID } from "crypto";

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: "pending" | "active" | "unsubscribed" | "bounced";
  source?: string;
  confirmed_at?: Date;
  created_at: Date;
}

export const subscriberService = {
  async create(email: string, name?: string, source = "website"): Promise<Subscriber> {
    const confirmToken = randomUUID();
    const { rows } = await query<Subscriber>(
      `INSERT INTO subscribers (email, name, source, confirm_token)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [email.toLowerCase().trim(), name, source, confirmToken]
    );
    return rows[0];
  },

  async confirm(token: string): Promise<Subscriber | null> {
    const { rows } = await query<Subscriber>(
      `UPDATE subscribers
       SET status = 'active', confirmed_at = now(), confirm_token = null
       WHERE confirm_token = $1 AND status = 'pending'
       RETURNING *`,
      [token]
    );
    return rows[0] ?? null;
  },

  async unsubscribe(token: string): Promise<Subscriber | null> {
    const { rows } = await query<Subscriber>(
      `UPDATE subscribers
       SET status = 'unsubscribed', unsubscribed_at = now()
       WHERE unsubscribe_token = $1 AND status = 'active'
       RETURNING *`,
      [token]
    );
    return rows[0] ?? null;
  },

  async findByEmail(email: string): Promise<Subscriber | null> {
    const { rows } = await query<Subscriber>(
      "SELECT * FROM subscribers WHERE email = $1",
      [email.toLowerCase().trim()]
    );
    return rows[0] ?? null;
  },

  async list(status?: string, limit = 50, offset = 0): Promise<{ subscribers: Subscriber[]; total: number }> {
    const where = status ? "WHERE status = $3" : "";
    const params: any[] = [limit, offset, ...(status ? [status] : [])];
    const [{ rows: subscribers }, { rows: [{ count }] }] = await Promise.all([
      query<Subscriber>(`SELECT * FROM subscribers ${where} ORDER BY created_at DESC LIMIT $1 OFFSET $2`, params),
      query<{ count: string }>(`SELECT COUNT(*) FROM subscribers ${status ? "WHERE status = $1" : ""}`, status ? [status] : []),
    ]);
    return { subscribers, total: parseInt(count) };
  },

  async getStats(): Promise<{ total: number; active: number; pending: number; unsubscribed: number }> {
    const { rows } = await query<{ status: string; count: string }>(
      "SELECT status, COUNT(*) FROM subscribers GROUP BY status"
    );
    const map: Record<string, number> = {};
    rows.forEach((r) => (map[r.status] = parseInt(r.count)));
    return {
      total: Object.values(map).reduce((a, b) => a + b, 0),
      active: map.active ?? 0,
      pending: map.pending ?? 0,
      unsubscribed: map.unsubscribed ?? 0,
    };
  },
};
