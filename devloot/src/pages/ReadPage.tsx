import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useIssue, useIssues } from "../hooks/useIssues";
import { Section } from "../services/api";

const renderSection = (section: Section, i: number) => {
  switch (section.type) {
    case "intro":
      return (
        <p key={i} className="font-display text-xl italic leading-relaxed text-ink/80 border-l-2 border-accent pl-6 mb-10">
          {section.text}
        </p>
      );
    case "h2":
      return <h2 key={i} className="font-display text-2xl text-ink mt-12 mb-4">{section.text}</h2>;
    case "p":
      return <p key={i} className="font-body text-base leading-relaxed text-ink/80 mb-6">{section.text}</p>;
    case "code":
      return (
        <div key={i} className="mb-8">
          <div className="flex items-center justify-between bg-ink px-4 py-2 border border-ink">
            <span className="font-mono text-xs text-cream/40">{section.language}</span>
            <span className="font-mono text-xs text-cream/40">code</span>
          </div>
          <pre className="bg-dim text-cream/80 font-mono text-sm leading-relaxed p-5 border border-t-0 border-ink overflow-x-auto whitespace-pre">
            <code>{section.text}</code>
          </pre>
        </div>
      );
    case "quote":
      return (
        <blockquote key={i} className="my-10 border-l-4 border-accent pl-6">
          <p className="font-display text-2xl italic text-ink leading-snug">"{section.text}"</p>
        </blockquote>
      );
    case "divider":
      return (
        <div key={i} className="my-10 flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-muted">✦</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      );
    case "list":
      return (
        <ul key={i} className="mb-8 space-y-3">
          {section.items?.map((item, j) => (
            <li key={j} className="flex items-start gap-3 font-body text-base text-ink/80">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
};

const ReadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { issue, loading, error } = useIssue(id);
  const { issues: allIssues } = useIssues(50, 0);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-32">
        <div className="max-w-3xl mx-auto px-8 animate-pulse space-y-6">
          <div className="h-4 bg-border rounded w-1/4" />
          <div className="h-10 bg-border rounded w-5/6" />
          <div className="h-10 bg-border rounded w-4/6" />
          <div className="h-4 bg-border rounded w-full" />
          <div className="h-4 bg-border rounded w-full" />
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-sm text-muted mb-4">{error ?? "Issue not found"}</p>
          <button onClick={() => navigate("/archive")} className="font-mono text-xs text-ink underline">
            ← Back to archive
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = allIssues.findIndex((i) => i.id === id);
  const prevIssue = allIssues[currentIndex + 1];
  const nextIssue = allIssues[currentIndex - 1];

  return (
    <div className="min-h-screen bg-cream pt-20">
      <header className="border-b border-border bg-cream/90 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-8 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/archive")} className="font-mono text-xs text-muted hover:text-ink transition-colors">
            ← Archive
          </button>
          <span className="font-mono text-xs text-muted">Issue #{issue.number}</span>
          <span className="font-mono text-xs text-muted">{issue.read_time} read</span>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-8 py-16">
        <div className="mb-10 animate-fade-up">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {issue.tags.map((tag) => (
              <span key={tag} className="tag text-muted">{tag}</span>
            ))}
            {issue.featured && <span className="bg-accent text-ink font-mono text-xs px-2 py-0.5">FEATURED</span>}
          </div>
          <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-tight text-ink mb-6">{issue.title}</h1>
          <div className="flex items-center gap-6 border-t border-border pt-6">
            <div>
              <p className="font-body text-sm font-medium text-ink">{issue.author_name}</p>
              <p className="font-mono text-xs text-muted">
                {issue.published_at ? new Date(issue.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
              </p>
            </div>
            <div className="ml-auto">
              <span className="font-mono text-xs text-muted">{issue.read_time} read</span>
            </div>
          </div>
        </div>

        <div>{issue.content.map((section, i) => renderSection(section, i))}</div>

        <div className="mt-20 pt-10 border-t border-border grid grid-cols-2 gap-4">
          {prevIssue ? (
            <Link to={`/read/${prevIssue.id}`} className="group border border-border p-5 hover:bg-white transition-colors">
              <p className="font-mono text-xs text-muted mb-2">← Previous</p>
              <p className="font-display text-base text-ink group-hover:text-dim transition-colors line-clamp-2">{prevIssue.title}</p>
            </Link>
          ) : <div />}
          {nextIssue ? (
            <Link to={`/read/${nextIssue.id}`} className="group border border-border p-5 hover:bg-white transition-colors text-right">
              <p className="font-mono text-xs text-muted mb-2">Next →</p>
              <p className="font-display text-base text-ink group-hover:text-dim transition-colors line-clamp-2">{nextIssue.title}</p>
            </Link>
          ) : <div />}
        </div>
      </article>
    </div>
  );
};

export default ReadPage;
