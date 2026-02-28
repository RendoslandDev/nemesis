import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { issuesApi, Section, ApiIssue } from "../services/api";

type BlockType = "p" | "h2" | "code" | "quote" | "list" | "divider";
interface Block { id: string; type: BlockType; content: string; }

const genId = () => Math.random().toString(36).slice(2, 8);

const BLOCK_LABELS: Record<BlockType, string> = {
  p: "Paragraph", h2: "Heading", code: "Code Block",
  quote: "Pull Quote", list: "Bullet List", divider: "Divider",
};
const BLOCK_ICONS: Record<BlockType, string> = {
  p: "¶", h2: "H", code: "</>", quote: "❝", list: "≡", divider: "—",
};

function blocksToSections(blocks: Block[]): Section[] {
  return blocks.map((b) => {
    if (b.type === "list") return { type: "list", items: b.content.split("\n").filter(Boolean) };
    if (b.type === "code") return { type: "code", language: "code", text: b.content };
    if (b.type === "divider") return { type: "divider" };
    return { type: b.type as Section["type"], text: b.content };
  });
}

function sectionsToBlocks(sections: Section[]): Block[] {
  return sections.map((s) => ({
    id: genId(),
    type: (s.type === "intro" ? "p" : s.type === "divider" ? "divider" : s.type) as BlockType,
    content: s.type === "list" ? (s.items ?? []).join("\n") : s.text ?? "",
  }));
}

const PostPage: React.FC = () => {
  const { token, isAuthed, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [issueId, setIssueId] = useState<string | null>(searchParams.get("id"));
  const [loadingDraft, setLoadingDraft] = useState(!!searchParams.get("id"));

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState("");
  const [featured, setFeatured] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([{ id: genId(), type: "p", content: "" }]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [publishState, setPublishState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Load draft if ?id= is in the URL
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id || !token) { setLoadingDraft(false); return; }
    issuesApi.listAll(token, undefined, 100, 0)
      .then(({ issues }) => {
        const issue = issues.find((i: ApiIssue) => i.id === id);
        if (issue) {
          setTitle(issue.title);
          setExcerpt(issue.excerpt);
          setTags(issue.tags.join(", "));
          setReadTime(issue.read_time);
          setFeatured(issue.featured);
          setBlocks(issue.content?.length
            ? sectionsToBlocks(issue.content)
            : [{ id: genId(), type: "p", content: "" }]);
          setIssueId(issue.id);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingDraft(false));
  }, [searchParams, token]);

  const addBlock = useCallback((type: BlockType, afterId?: string) => {
    const nb: Block = { id: genId(), type, content: "" };
    setBlocks((prev) => {
      if (!afterId) return [...prev, nb];
      const idx = prev.findIndex((b) => b.id === afterId);
      const next = [...prev];
      next.splice(idx + 1, 0, nb);
      return next;
    });
    setActiveBlockId(nb.id);
  }, []);

  const updateBlock = useCallback((id: string, content: string) => {
    setBlocks((prev) => prev.map((b) => b.id === id ? { ...b, content } : b));
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.length === 1 ? prev : prev.filter((b) => b.id !== id));
  }, []);

  const changeBlockType = useCallback((id: string, type: BlockType) => {
    setBlocks((prev) => prev.map((b) => b.id === id ? { ...b, type } : b));
  }, []);

  const validate = () => {
    if (!title.trim()) return "Title is required";
    if (!excerpt.trim()) return "Excerpt is required";
    if (title.trim().length < 5) return "Title must be at least 5 characters";
    if (excerpt.trim().length < 10) return "Excerpt must be at least 10 characters";
    return null;
  };

  const buildPayload = (status: "draft" | "published") => ({
    title: title.trim(),
    excerpt: excerpt.trim(),
    content: blocksToSections(blocks),
    tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    read_time: readTime.trim() || "5 min",
    featured,
    status,
  });

  const handleSave = async () => {
    const err = validate();
    if (err) { setErrorMsg(err); return; }
    if (!token) return;
    setSaveState("saving"); setErrorMsg("");
    try {
      if (issueId) {
        await issuesApi.update(token, issueId, buildPayload("draft"));
      } else {
        const issue = await issuesApi.create(token, buildPayload("draft"));
        setIssueId(issue.id);
        window.history.replaceState({}, "", `/post?id=${issue.id}`);
      }
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch (e: any) {
      setErrorMsg(e.message); setSaveState("error");
    }
  };

  const handlePublish = async () => {
    const err = validate();
    if (err) { setErrorMsg(err); return; }
    if (!token) return;
    setPublishState("saving"); setErrorMsg("");
    try {
      let issue: ApiIssue;
      if (issueId) {
        issue = await issuesApi.update(token, issueId, buildPayload("published")) as ApiIssue;
      } else {
        issue = await issuesApi.create(token, buildPayload("published"));
      }
      setPublishState("saved");
      setTimeout(() => navigate(`/read/${issue.id}`), 800);
    } catch (e: any) {
      setErrorMsg(e.message); setPublishState("error");
    }
  };

  if (authLoading || loadingDraft) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-xs text-muted">Loading...</span>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream pt-20">
        <div className="border border-border p-10 max-w-sm w-full text-center">
          <span className="tag text-muted mb-4 inline-block">Restricted</span>
          <h2 className="font-display text-2xl text-ink mb-4">Sign in to write</h2>
          <button onClick={() => navigate("/login")}
            className="w-full bg-ink text-cream font-mono text-xs tracking-wider uppercase py-3 hover:bg-dim transition-colors">
            Sign in →
          </button>
        </div>
      </div>
    );
  }

  const renderBlock = (block: Block) => {
    const isActive = activeBlockId === block.id;
    return (
      <div key={block.id} className={`group relative mb-2 ${isActive ? "z-10" : ""}`}
        onClick={() => setActiveBlockId(block.id)}>
        <div className={`absolute -left-32 top-1 flex items-center gap-1 transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}>
          <select value={block.type} onChange={(e) => changeBlockType(block.id, e.target.value as BlockType)}
            className="font-mono text-xs text-muted bg-transparent border border-border px-1 py-0.5 focus:outline-none">
            {(Object.keys(BLOCK_LABELS) as BlockType[]).map((t) => (
              <option key={t} value={t}>{BLOCK_ICONS[t]}</option>
            ))}
          </select>
          <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
            className="font-mono text-xs text-muted hover:text-red-500 border border-border px-1.5 py-0.5">✕</button>
        </div>

        {block.type === "p" && (
          <textarea value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Write something..." rows={3}
            className="w-full font-body text-base leading-relaxed text-ink/80 bg-transparent resize-none focus:outline-none placeholder:text-muted/30 border border-transparent focus:border-border transition-colors p-2 -mx-2" />
        )}
        {block.type === "h2" && (
          <input value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Section heading..."
            className="w-full font-display text-2xl text-ink bg-transparent focus:outline-none placeholder:text-muted/30 border border-transparent focus:border-border transition-colors p-2 -mx-2" />
        )}
        {block.type === "code" && (
          <div className="border border-border">
            <div className="bg-ink px-4 py-2"><span className="font-mono text-xs text-accent">CODE</span></div>
            <textarea value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="// paste your code here" rows={6}
              className="w-full bg-dim text-cream/80 font-mono text-sm leading-relaxed p-4 focus:outline-none resize-none" />
          </div>
        )}
        {block.type === "quote" && (
          <div className="border-l-4 border-accent pl-6 py-2">
            <textarea value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="A memorable quote..." rows={2}
              className="w-full font-display text-2xl italic text-ink bg-transparent focus:outline-none placeholder:text-muted/30 resize-none" />
          </div>
        )}
        {block.type === "list" && (
          <div className="space-y-2 py-2">
            {(block.content ? block.content.split("\n") : [""]).map((item, i, arr) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <input value={item}
                  onChange={(e) => { const u = [...arr]; u[i] = e.target.value; updateBlock(block.id, u.join("\n")); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); const u = [...arr]; u.splice(i + 1, 0, ""); updateBlock(block.id, u.join("\n")); }
                    if (e.key === "Backspace" && item === "" && arr.length > 1) { e.preventDefault(); updateBlock(block.id, arr.filter((_, j) => j !== i).join("\n")); }
                  }}
                  placeholder="List item..."
                  className="flex-1 font-body text-base text-ink/80 bg-transparent focus:outline-none placeholder:text-muted/30" />
              </div>
            ))}
          </div>
        )}
        {block.type === "divider" && (
          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-px bg-border" />
            <span className="font-mono text-xs text-muted">✦</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="border-b border-border bg-cream/90 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-muted mr-2">Add block:</span>
            {(Object.keys(BLOCK_LABELS) as BlockType[]).map((type) => (
              <button key={type} onClick={() => addBlock(type, activeBlockId || undefined)}
                className="font-mono text-xs border border-border px-2 py-1 text-muted hover:border-ink hover:text-ink transition-colors">
                {BLOCK_ICONS[type]} {BLOCK_LABELS[type]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {issueId && <span className="font-mono text-xs text-muted/50 hidden md:block">editing draft</span>}
            <button onClick={handleSave} disabled={saveState === "saving"}
              className={`font-mono text-xs px-4 py-2 border transition-colors ${
                saveState === "saved" ? "border-accent bg-accent text-ink"
                : saveState === "error" ? "border-red-400 text-red-500"
                : "border-border text-muted hover:border-ink hover:text-ink"
              }`}>
              {saveState === "saving" ? "Saving..." : saveState === "saved" ? "✓ Saved" : "Save Draft"}
            </button>
            <button onClick={handlePublish} disabled={publishState === "saving"}
              className="font-mono text-xs px-5 py-2 bg-ink text-cream hover:bg-dim transition-colors disabled:opacity-60">
              {publishState === "saving" ? "Publishing..." : publishState === "saved" ? "✓ Published!" : "Publish →"}
            </button>
          </div>
        </div>
        {errorMsg && (
          <div className="max-w-5xl mx-auto px-8 pb-2">
            <p className="font-mono text-xs text-red-500">{errorMsg}</p>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12 flex gap-12">
        <div className="flex-1 min-w-0">
          <div className="mb-10 pb-10 border-b border-border">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Issue title..."
              className="w-full font-display text-[clamp(1.8rem,4vw,3rem)] text-ink bg-transparent focus:outline-none placeholder:text-muted/30 mb-4 leading-tight" />
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short excerpt shown in cards and previews..." rows={2}
              className="w-full font-body text-base text-muted bg-transparent focus:outline-none placeholder:text-muted/30 resize-none mb-4 leading-relaxed" />
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted">Tags:</span>
                <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tools, AI, workflow"
                  className="font-mono text-xs text-muted bg-transparent border-b border-border focus:outline-none focus:border-ink pb-0.5 w-44" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted">Read time:</span>
                <input value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="8 min"
                  className="font-mono text-xs text-muted bg-transparent border-b border-border focus:outline-none focus:border-ink pb-0.5 w-20" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-3 h-3" />
                <span className="font-mono text-xs text-muted">Featured</span>
              </label>
            </div>
          </div>

          <div className="pl-32 relative">
            {blocks.map((block) => renderBlock(block))}
            <button onClick={() => addBlock("p")}
              className="mt-6 font-mono text-xs text-muted hover:text-ink flex items-center gap-2 transition-colors border border-dashed border-border hover:border-ink px-4 py-2">
              + Add paragraph
            </button>
          </div>
        </div>

        <aside className="w-60 shrink-0 hidden lg:block">
          <div className="sticky top-36 space-y-5">
            <div className="border border-border p-5">
              <h3 className="font-mono text-xs text-muted uppercase tracking-wider mb-4">Status</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-mono text-xs text-muted mb-1">State</p>
                  <span className="tag text-muted">{issueId ? "Draft saved" : "Not saved yet"}</span>
                </div>
                <div><p className="font-mono text-xs text-muted mb-1">Blocks</p><p className="font-mono text-sm text-ink">{blocks.length}</p></div>
              </div>
            </div>
            <button onClick={() => navigate("/admin")}
              className="w-full border border-border text-muted font-mono text-xs tracking-wider uppercase py-3 hover:border-ink hover:text-ink transition-colors">
              ← All drafts
            </button>
            <button onClick={handlePublish} disabled={publishState === "saving"}
              className="w-full bg-ink text-cream font-mono text-xs tracking-wider uppercase py-3 hover:bg-dim transition-colors disabled:opacity-60">
              {publishState === "saving" ? "Publishing..." : "Publish Issue →"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PostPage;
