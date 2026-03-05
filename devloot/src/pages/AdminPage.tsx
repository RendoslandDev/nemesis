import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { issuesApi, subscribersApi, ApiIssue, SubscriberStats } from "../services/api";

type Tab = "issues" | "subscribers";
type StatusFilter = "all" | "draft" | "published" | "scheduled";

const STATUS_COLORS: Record<string, string> = {
  published: "bg-accent text-ink",
  draft:     "border border-border text-muted",
  scheduled: "border border-ink text-ink bg-cream",
};

const AdminPage: React.FC = () => {
  const { token, isAdmin, isAuthed, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("issues");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [issues, setIssues] = useState<ApiIssue[]>([]);
  const [issuesTotal, setIssuesTotal] = useState(0);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [issuesError, setIssuesError] = useState<string | null>(null);
  const [stats, setStats] = useState<SubscriberStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [actionState, setActionState] = useState<Record<string, string>>({});

  const fetchIssues = useCallback(async () => {
    if (!token) return;
    setIssuesLoading(true);
    setIssuesError(null);
    try {
      const status = statusFilter === "all" ? undefined : statusFilter;
      const result = await issuesApi.listAll(token, status, 100, 0);
      setIssues(result.issues);
      setIssuesTotal(result.total);
    } catch (e: any) {
      setIssuesError(e.message);
    } finally {
      setIssuesLoading(false);
    }
  }, [token, statusFilter]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    setStatsLoading(true);
    try { const s = await subscribersApi.stats(token); setStats(s); } catch {}
    finally { setStatsLoading(false); }
  }, [token]);

  useEffect(() => { fetchIssues(); }, [fetchIssues]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const publish = async (issue: ApiIssue) => {
    if (!token) return;
    setActionState((s) => ({ ...s, [issue.id]: "publishing..." }));
    try {
      await issuesApi.update(token, issue.id, { status: "published" } as any);
      setActionState((s) => ({ ...s, [issue.id]: "✓ published" }));
      fetchIssues();
    } catch (e: any) {
      setActionState((s) => ({ ...s, [issue.id]: "error: " + e.message }));
    }
  };

  const unpublish = async (issue: ApiIssue) => {
    if (!token) return;
    setActionState((s) => ({ ...s, [issue.id]: "unpublishing..." }));
    try {
      await issuesApi.update(token, issue.id, { status: "draft" } as any);
      setActionState((s) => ({ ...s, [issue.id]: "moved to draft" }));
      fetchIssues();
    } catch (e: any) {
      setActionState((s) => ({ ...s, [issue.id]: "error: " + e.message }));
    }
  };

  const sendIssue = async (issue: ApiIssue) => {
    if (!token) return;
    if (!window.confirm(`Send issue #${issue.number} to all active subscribers? This cannot be undone.`)) return;
    setActionState((s) => ({ ...s, [issue.id]: "sending..." }));
    try {
      const res = await issuesApi.send(token, issue.id);
      setActionState((s) => ({ ...s, [issue.id]: `sent to ${res.subscriber_count}` }));
      fetchIssues();
    } catch (e: any) {
      setActionState((s) => ({ ...s, [issue.id]: "error: " + e.message }));
    }
  };

  const deleteIssue = async (issue: ApiIssue) => {
    if (!token) return;
    if (!window.confirm(`Delete "${issue.title}"? This cannot be undone.`)) return;
    try { await issuesApi.delete(token, issue.id); fetchIssues(); }
    catch (e: any) { alert(e.message); }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="font-mono text-xs text-muted">Loading...</span>
    </div>
  );

  if (!isAuthed) return (
    <div className="min-h-screen flex items-center justify-center bg-cream pt-20">
      <div className="border border-border p-10 max-w-sm w-full text-center">
        <h2 className="font-display text-2xl text-ink mb-4">Sign in required</h2>
        <button onClick={() => navigate("/login")}
          className="w-full bg-ink text-cream font-mono text-xs tracking-wider uppercase py-3 hover:bg-dim transition-colors">
          Sign in →
        </button>
      </div>
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-cream pt-20">
      <div className="border border-border p-10 max-w-sm w-full text-center">
        <h2 className="font-display text-2xl text-ink mb-4">Admin access only</h2>
        <Link to="/" className="font-mono text-xs text-muted underline">← Back to home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="border-b border-border bg-cream">
        <div className="max-w-6xl mx-auto px-8 py-10">
          <div className="flex items-end justify-between">
            <div>
              <span className="tag text-muted mb-3 inline-block">Admin</span>
              <h1 className="font-display text-4xl text-ink">Dashboard</h1>
            </div>
            <Link to="/post"
              className="bg-ink text-cream font-mono text-xs tracking-wider uppercase px-6 py-3 hover:bg-dim transition-colors">
              + New Issue
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Total issues", value: issuesTotal },
              { label: "Active subscribers", value: statsLoading ? "—" : stats?.active ?? 0 },
              { label: "Pending confirm", value: statsLoading ? "—" : stats?.pending ?? 0 },
              { label: "Unsubscribed", value: statsLoading ? "—" : stats?.unsubscribed ?? 0 },
            ].map(({ label, value }) => (
              <div key={label} className="border border-border p-4 bg-white">
                <div className="font-display text-3xl text-ink">{value}</div>
                <div className="font-mono text-xs text-muted mt-1 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-cream">
        <div className="max-w-6xl mx-auto px-8 flex gap-0">
          {(["issues", "subscribers"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`font-mono text-xs tracking-wider uppercase px-6 py-4 border-b-2 transition-colors ${
                tab === t ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {tab === "issues" && (
          <>
            <div className="flex gap-2 mb-6">
              {(["all", "draft", "published", "scheduled"] as StatusFilter[]).map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`font-mono text-xs px-3 py-1.5 border transition-colors ${
                    statusFilter === s ? "bg-ink text-cream border-ink" : "border-border text-muted hover:border-ink hover:text-ink"
                  }`}>
                  {s}
                </button>
              ))}
              <button onClick={fetchIssues}
                className="ml-auto font-mono text-xs text-muted hover:text-ink border border-border px-3 py-1.5 transition-colors">
                ↻ Refresh
              </button>
            </div>

            {issuesLoading && (
              <div className="border border-border animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="px-6 py-5 border-b border-border flex gap-4 items-center">
                    <div className="h-3 bg-border rounded w-12" />
                    <div className="h-4 bg-border rounded flex-1" />
                    <div className="h-6 bg-border rounded w-20" />
                  </div>
                ))}
              </div>
            )}

            {issuesError && <p className="font-mono text-sm text-red-500 py-8">{issuesError}</p>}

            {!issuesLoading && !issuesError && issues.length === 0 && (
              <div className="border border-border py-20 text-center">
                <p className="font-mono text-sm text-muted mb-6">No issues yet.</p>
                <Link to="/post"
                  className="bg-ink text-cream font-mono text-xs tracking-wider uppercase px-6 py-3 hover:bg-dim transition-colors">
                  Write your first issue →
                </Link>
              </div>
            )}

            {!issuesLoading && !issuesError && issues.length > 0 && (
              <div className="border border-border">
                <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-ink text-cream/50 font-mono text-xs tracking-wider uppercase">
                  <span className="col-span-1">#</span>
                  <span className="col-span-4">Title</span>
                  <span className="col-span-2">Status</span>
                  <span className="col-span-2">Date</span>
                  <span className="col-span-3 text-right">Actions</span>
                </div>
                {issues.map((issue, idx) => (
                  <div key={issue.id}
                    className={`grid grid-cols-12 gap-2 px-6 py-4 items-center ${idx < issues.length - 1 ? "border-b border-border" : ""}`}>
                    <span className="col-span-1 font-mono text-xs text-muted">{issue.number}</span>
                    <div className="col-span-4">
                      <p className="font-display text-sm text-ink leading-snug line-clamp-1">{issue.title}</p>
                      <p className="font-mono text-xs text-muted mt-0.5 line-clamp-1">{issue.excerpt}</p>
                    </div>
                    <div className="col-span-2">
                      <span className={`font-mono text-xs px-2 py-0.5 ${STATUS_COLORS[issue.status] ?? "text-muted"}`}>
                        {issue.status}
                      </span>
                      {issue.sent_at && <p className="font-mono text-xs text-muted mt-1">sent {issue.sent_count}</p>}
                    </div>
                    <div className="col-span-2">
                      <span className="font-mono text-xs text-muted">
                        {new Date(issue.published_at ?? issue.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center justify-end gap-2 flex-wrap">
                      {actionState[issue.id] && (
                        <span className={`font-mono text-xs ${actionState[issue.id].startsWith("error") ? "text-red-500" : "text-muted"}`}>
                          {actionState[issue.id]}
                        </span>
                      )}

                      {/* Edit — opens draft in editor */}
                      <Link to={`/post?id=${issue.id}`}
                        className="font-mono text-xs border border-border px-2 py-1 text-muted hover:border-ink hover:text-ink transition-colors">
                        Edit
                      </Link>

                      {/* View live */}
                      {issue.status === "published" && (
                        <Link to={`/read/${issue.id}`}
                          className="font-mono text-xs border border-border px-2 py-1 text-muted hover:border-ink hover:text-ink transition-colors">
                          View
                        </Link>
                      )}

                      {/* Publish draft */}
                      {issue.status === "draft" && (
                        <button onClick={() => publish(issue)}
                          className="font-mono text-xs border border-ink px-2 py-1 text-ink hover:bg-ink hover:text-cream transition-colors">
                          Publish
                        </button>
                      )}

                      {/* Unpublish + Send */}
                      {issue.status === "published" && !issue.sent_at && (
                        <>
                          <button onClick={() => unpublish(issue)}
                            className="font-mono text-xs border border-border px-2 py-1 text-muted hover:border-ink hover:text-ink transition-colors">
                            Unpublish
                          </button>
                          <button onClick={() => sendIssue(issue)}
                            className="font-mono text-xs bg-accent text-ink px-2 py-1 hover:opacity-80 transition-opacity">
                            Send Email
                          </button>
                        </>
                      )}

                      {issue.status === "published" && issue.sent_at && (
                        <span className="font-mono text-xs text-muted">✓ Sent</span>
                      )}

                      <button onClick={() => deleteIssue(issue)}
                        className="font-mono text-xs border border-border px-2 py-1 text-muted hover:border-red-400 hover:text-red-500 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "subscribers" && <SubscribersTab token={token!} />}
      </div>
    </div>
  );
};

const SubscribersTab: React.FC<{ token: string }> = ({ token }) => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("active");

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await subscribersApi.list(token, statusFilter === "all" ? undefined : statusFilter, 100, 0);
      setSubscribers(res.subscribers);
      setTotal(res.total);
    } catch {}
    finally { setLoading(false); }
  }, [token, statusFilter]);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  const STATUS_COLORS: Record<string, string> = {
    active: "bg-accent text-ink",
    pending: "border border-ink text-ink",
    unsubscribed: "border border-border text-muted",
    bounced: "border border-red-400 text-red-500",
  };

  return (
    <>
      <div className="flex gap-2 mb-6">
        {["all", "active", "pending", "unsubscribed"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`font-mono text-xs px-3 py-1.5 border transition-colors ${
              statusFilter === s ? "bg-ink text-cream border-ink" : "border-border text-muted hover:border-ink hover:text-ink"
            }`}>
            {s}
          </button>
        ))}
        <button onClick={fetchSubs}
          className="ml-auto font-mono text-xs text-muted hover:text-ink border border-border px-3 py-1.5 transition-colors">
          ↻ Refresh
        </button>
      </div>

      <p className="font-mono text-xs text-muted mb-4">{total} subscriber{total !== 1 ? "s" : ""}</p>

      {loading ? (
        <div className="border border-border animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-border flex gap-4">
              <div className="h-3 bg-border rounded flex-1" />
              <div className="h-3 bg-border rounded w-24" />
            </div>
          ))}
        </div>
      ) : subscribers.length === 0 ? (
        <div className="border border-border py-16 text-center">
          <p className="font-mono text-sm text-muted">No subscribers found.</p>
        </div>
      ) : (
        <div className="border border-border">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-ink text-cream/50 font-mono text-xs tracking-wider uppercase">
            <span className="col-span-5">Email</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-3">Source</span>
            <span className="col-span-2 text-right">Joined</span>
          </div>
          {subscribers.map((sub, idx) => (
            <div key={sub.id}
              className={`grid grid-cols-12 gap-4 px-6 py-3 items-center ${idx < subscribers.length - 1 ? "border-b border-border" : ""}`}>
              <span className="col-span-5 font-mono text-xs text-ink">{sub.email}</span>
              <span className={`col-span-2 font-mono text-xs px-2 py-0.5 w-fit ${STATUS_COLORS[sub.status] ?? "text-muted"}`}>
                {sub.status}
              </span>
              <span className="col-span-3 font-mono text-xs text-muted">{sub.source ?? "—"}</span>
              <span className="col-span-2 font-mono text-xs text-muted text-right">
                {new Date(sub.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AdminPage;
