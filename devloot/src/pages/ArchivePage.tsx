import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useIssues } from "../hooks/useIssues";

const ALL_TAGS = ["All", "tools", "AI", "creator", "indie", "typescript", "productivity", "API", "DX", "monetization", "newsletter", "engineering", "automation", "workflow"];

const ArchivePage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const { issues, total, loading, error } = useIssues(100, 0);

  const filtered = useMemo(() => issues.filter((issue) => {
    const matchesTag = activeTag === "All" || issue.tags.includes(activeTag);
    const q = search.toLowerCase();
    const matchesSearch = !q
      || issue.title.toLowerCase().includes(q)
      || issue.excerpt.toLowerCase().includes(q)
      || issue.tags.some((t) => t.toLowerCase().includes(q));
    return matchesTag && matchesSearch;
  }), [issues, search, activeTag]);

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="border-b border-border bg-cream">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <span className="tag text-muted mb-4 inline-block">Every issue, ever</span>
          <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-ink leading-tight">Archive</h1>
            <div className="flex items-center gap-3 font-mono text-sm text-muted">
              <span className="text-2xl font-display text-ink">{total}</span>
              issues published
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-muted text-sm">⌕</span>
            <input
              type="text"
              placeholder="Search issues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-border bg-white pl-10 pr-4 py-3 font-mono text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`tag transition-colors ${activeTag === tag ? "bg-ink text-cream border-ink" : "text-muted hover:text-ink hover:border-ink"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="border border-border animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-border flex gap-4 items-center">
                <div className="h-3 bg-border rounded w-12" />
                <div className="h-4 bg-border rounded flex-1" />
                <div className="h-3 bg-border rounded w-24" />
              </div>
            ))}
          </div>
        )}

        {error && <p className="font-mono text-sm text-red-500 py-16 text-center">{error}</p>}

        {!loading && !error && (
          <>
            <p className="font-mono text-xs text-muted mb-6">
              {filtered.length} issue{filtered.length !== 1 ? "s" : ""} found
              {search && ` for "${search}"`}
            </p>

            <div className="border border-border">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-ink text-cream/50 font-mono text-xs tracking-wider uppercase border-b border-border">
                <span className="col-span-1">#</span>
                <span className="col-span-5">Title</span>
                <span className="col-span-3 hidden md:block">Tags</span>
                <span className="col-span-2 hidden md:block">Date</span>
                <span className="col-span-1 text-right">Time</span>
              </div>

              {filtered.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <p className="font-mono text-sm text-muted">No issues match your search.</p>
                </div>
              ) : (
                filtered.map((issue, idx) => (
                  <div
                    key={issue.id}
                    onClick={() => navigate(`/read/${issue.id}`)}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer hover:bg-white transition-colors group ${idx < filtered.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <span className="col-span-1 font-mono text-xs text-muted/60">{issue.number}</span>
                    <div className="col-span-5">
                      <p className="font-display text-base text-ink group-hover:text-dim transition-colors leading-snug">{issue.title}</p>
                      {issue.featured && <span className="inline-block mt-1 bg-accent text-ink font-mono text-xs px-1.5 py-0.5">FEATURED</span>}
                    </div>
                    <div className="col-span-3 hidden md:flex flex-wrap gap-1.5">
                      {issue.tags.map((tag) => <span key={tag} className="tag text-muted text-xs">{tag}</span>)}
                    </div>
                    <span className="col-span-2 hidden md:block font-mono text-xs text-muted">
                      {issue.published_at ? new Date(issue.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </span>
                    <span className="col-span-1 font-mono text-xs text-muted text-right group-hover:text-ink transition-colors">
                      {issue.read_time} →
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;
