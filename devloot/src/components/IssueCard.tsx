import React from "react";
import { useNavigate } from "react-router-dom";
import { ApiIssue } from "../services/api";

interface IssueCardProps {
  issue: ApiIssue;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/read/${issue.id}`)}
      className="issue-card group border border-border p-6 bg-white/50 hover:bg-white transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted/60">#{issue.number}</span>
          {issue.featured && (
            <span className="bg-accent text-ink font-mono text-xs px-2 py-0.5">FEATURED</span>
          )}
        </div>
        <span className="font-mono text-xs text-muted">
          {issue.published_at
            ? new Date(issue.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "—"}
        </span>
      </div>
      <h3 className="font-display text-xl leading-snug text-ink mb-3 group-hover:text-dim transition-colors">
        {issue.title}
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-5 line-clamp-2">{issue.excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {issue.tags.map((tag) => (
            <span key={tag} className="tag text-muted">{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-4 shrink-0 ml-4">
          <span className="font-mono text-xs text-muted">{issue.read_time}</span>
          <span className="issue-arrow font-mono text-xs text-ink transition-transform duration-200">→</span>
        </div>
      </div>
    </article>
  );
};

export default IssueCard;
