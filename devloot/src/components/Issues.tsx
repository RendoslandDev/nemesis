import React, { useState } from "react";
import IssueCard from "./IssueCard";
import { useIssues } from "../hooks/useIssues";

const TAGS = ["All", "tools", "AI", "creator", "indie", "typescript", "productivity"];

const Issues: React.FC = () => {
  const [activeTag, setActiveTag] = useState("All");
  const { issues, loading, error } = useIssues(20, 0);

  const filtered = activeTag === "All"
    ? issues
    : issues.filter((i) => i.tags.includes(activeTag));

  return (
    <section id="issues" className="px-8 py-24 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border pb-8 gap-6">
        <div>
          <span className="tag text-muted mb-3 inline-block">Archive</span>
          <h2 className="font-display text-4xl text-ink">Past issues</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`tag transition-colors ${
                activeTag === tag
                  ? "bg-ink text-cream border-ink"
                  : "text-muted hover:text-ink hover:border-ink"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-border p-6 animate-pulse">
              <div className="h-3 bg-border rounded w-1/4 mb-4" />
              <div className="h-5 bg-border rounded w-5/6 mb-2" />
              <div className="h-5 bg-border rounded w-4/6 mb-4" />
              <div className="h-4 bg-border rounded w-full mb-2" />
              <div className="h-4 bg-border rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-muted">No issues found for "{activeTag}"</p>
        </div>
      )}
    </section>
  );
};

export default Issues;
