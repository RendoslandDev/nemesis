
const BASE = import.meta.env.VITE_API_URL ?? "https://lootbackend.onrender.com";

// ── Types ────────────────────────────────────────────────────────────────

export interface ApiIssue {
  id: string;
  number: number;
  slug: string;
  title: string;
  excerpt: string;
  content: Section[];
  tags: string[];
  read_time: string;
  status: "draft" | "scheduled" | "published";
  featured: boolean;
  author_id: string;
  author_name?: string;
  published_at?: string;
  sent_at?: string;
  sent_count: number;
  open_count: number;
  created_at: string;
  updated_at: string;
}

export interface Section {
  type: "intro" | "h2" | "p" | "code" | "quote" | "divider" | "list";
  text?: string;
  language?: string;
  items?: string[];
}

export interface Author {
  id: string;
  name: string;
  email: string;
  role: "author" | "admin";
  bio?: string;
  twitter?: string;
  avatar_url?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: "pending" | "active" | "unsubscribed" | "bounced";
  confirmed_at?: string;
  created_at: string;
}

export interface SubscriberStats {
  total: number;
  active: number;
  pending: number;
  unsubscribed: number;
}

export interface PaginatedIssues {
  issues: ApiIssue[];
  total: number;
}

export interface ApiError {
  error: string;
  errors?: { field: string; message: string }[];
}

// ── Core fetch helper ────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth ─────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; author: Author }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { name: string; email: string; password: string; bio?: string; twitter?: string }) =>
    request<{ token: string; author: Author }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: (token: string) =>
    request<Author>("/api/auth/me", {}, token),
};

// ── Issues ───────────────────────────────────────────────────────────────

export const issuesApi = {
  list: (limit = 20, offset = 0) =>
    request<PaginatedIssues>(`/api/issues?limit=${limit}&offset=${offset}`),

  listAll: (token: string, status?: string, limit = 20, offset = 0) =>
    request<PaginatedIssues>(
      `/api/issues/admin/all?limit=${limit}&offset=${offset}${status ? `&status=${status}` : ""}`,
      {},
      token
    ),

  get: (slugOrId: string) =>
    request<ApiIssue>(`/api/issues/${slugOrId}`),

  create: (
    token: string,
    data: {
      title: string;
      excerpt: string;
      content?: Section[];
      tags?: string[];
      read_time?: string;
      featured?: boolean;
      status?: "draft" | "published";
    }
  ) =>
    request<ApiIssue>("/api/issues", { method: "POST", body: JSON.stringify(data) }, token),

  update: (token: string, id: string, data: Partial<ApiIssue>) =>
    request<ApiIssue>(`/api/issues/${id}`, { method: "PATCH", body: JSON.stringify(data) }, token),

  delete: (token: string, id: string) =>
    request<void>(`/api/issues/${id}`, { method: "DELETE" }, token),

  send: (token: string, id: string) =>
    request<{ message: string; subscriber_count: number }>(
      `/api/issues/${id}/send`,
      { method: "POST" },
      token
    ),
};

// ── Subscribers ──────────────────────────────────────────────────────────

export const subscribersApi = {
  subscribe: (email: string, name?: string) =>
    request<{ message: string; id: string }>("/api/subscribers", {
      method: "POST",
      body: JSON.stringify({ email, name }),
    }),

  confirm: (token: string) =>
    request<{ message: string }>(`/api/subscribers/confirm?token=${token}`),

  unsubscribe: (token: string) =>
    request<{ message: string }>(`/api/subscribers/unsubscribe?token=${token}`),

  list: (authToken: string, status?: string, limit = 50, offset = 0) =>
    request<{ subscribers: Subscriber[]; total: number }>(
      `/api/subscribers?limit=${limit}&offset=${offset}${status ? `&status=${status}` : ""}`,
      {},
      authToken
    ),

  stats: (authToken: string) =>
    request<SubscriberStats>("/api/subscribers/stats", {}, authToken),
};
