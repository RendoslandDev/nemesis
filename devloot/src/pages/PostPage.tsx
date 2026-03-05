import React, { useState, useEffect } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// ─── Skeleton version of the Hero ────────────────────────────────────────────
const HeroSkeleton: React.FC = () => (
  <SkeletonTheme baseColor="#e8e4dc" highlightColor="#f2ede6">
    <section className="min-h-screen flex flex-col justify-center pt-20 px-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center py-24">

        {/* Left column skeleton */}
        <div>
          {/* Tag */}
          <Skeleton width={130} height={20} borderRadius={4} />

          {/* Headline — 3 lines of decreasing width */}
          <div className="mt-6 space-y-3">
            <Skeleton width="80%" height={68} borderRadius={4} />
            <Skeleton width="60%" height={68} borderRadius={4} />
            <Skeleton width="70%" height={68} borderRadius={4} />
          </div>

          {/* Body paragraph */}
          <div className="mt-8 space-y-2 max-w-md">
            <Skeleton height={16} borderRadius={4} />
            <Skeleton height={16} borderRadius={4} />
            <Skeleton width="75%" height={16} borderRadius={4} />
          </div>

          {/* Email form */}
          <div className="mt-10 max-w-md flex gap-0">
            <Skeleton height={46} borderRadius={0} containerClassName="flex-1" />
            <Skeleton width={120} height={46} borderRadius={0} />
          </div>

          {/* "Join 12,000+ …" line */}
          <div className="mt-3">
            <Skeleton width={240} height={12} borderRadius={4} />
          </div>
        </div>

        {/* Right column — "Latest issue" card skeleton */}
        <div className="relative">
          {/* Decorative offset border */}
          <div className="absolute -top-4 -left-4 w-full h-full border border-border" />
          <div className="relative bg-white border border-border p-8">
            {/* Tag + date */}
            <div className="flex items-center justify-between mb-6">
              <Skeleton width={90} height={18} borderRadius={4} />
              <Skeleton width={80} height={12} borderRadius={4} />
            </div>

            {/* Article title */}
            <div className="space-y-2 mb-4">
              <Skeleton height={28} borderRadius={4} />
              <Skeleton width="85%" height={28} borderRadius={4} />
            </div>

            {/* Article description */}
            <div className="space-y-2 mb-8">
              <Skeleton height={14} borderRadius={4} />
              <Skeleton height={14} borderRadius={4} />
              <Skeleton width="65%" height={14} borderRadius={4} />
            </div>

            {/* Tags row */}
            <div className="flex items-center gap-4">
              {[70, 40, 70, 60].map((w, i) => (
                <Skeleton key={i} width={w} height={16} borderRadius={4} />
              ))}
            </div>

            {/* Footer row */}
            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
              <Skeleton width={60} height={12} borderRadius={4} />
              <Skeleton width={80} height={12} borderRadius={4} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-t border-border pt-8 pb-16 grid grid-cols-3 md:grid-cols-4 gap-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton width={64} height={36} borderRadius={4} />
            <div className="mt-1">
              <Skeleton width={80} height={12} borderRadius={4} />
            </div>
          </div>
        ))}
      </div>
    </section>
  </SkeletonTheme>
);

// ─── Real Hero ────────────────────────────────────────────────────────────────
const HeroContent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 px-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center py-24">
        {/* Left */}
        <div>
          <div className="animate-fade-up">
            <span className="tag text-muted">Weekly newsletter</span>
          </div>

          <h1
            className="animate-fade-up delay-100 mt-6 font-display text-[clamp(3rem,6vw,5.5rem)] leading-[1.05] font-normal text-ink"
            style={{ animationDelay: "100ms" }}
          >
            The weekly read
            <br />
            <em className="italic text-muted">for builders</em>
            <br />
            who ship.
          </h1>

          <p
            className="animate-fade-up delay-200 mt-8 text-base font-body text-muted leading-relaxed max-w-md"
            style={{ animationDelay: "200ms" }}
          >
            Curated every Tuesday — developer tools, creator strategies, indie hacker
            insights, and the things worth reading this week. No noise. Just signal.
          </p>

          <div
            className="animate-fade-up delay-300 mt-10"
            style={{ animationDelay: "300ms" }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex gap-0 max-w-md">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="subscribe-input flex-1 border border-border border-r-0 bg-transparent px-4 py-3 font-mono text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors"
                />
                <button
                  type="submit"
                  className="bg-ink text-cream font-mono text-xs tracking-widest uppercase px-6 py-3 hover:bg-dim transition-colors whitespace-nowrap"
                >
                  Subscribe →
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3 max-w-md">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <p className="font-mono text-sm text-ink">
                  You're in. Issue #048 lands Tuesday.
                </p>
              </div>
            )}
            <p className="mt-3 font-mono text-xs text-muted/60">
              Join 12,000+ developers & creators. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Right */}
        <div
          className="animate-fade-up delay-400 relative"
          style={{ animationDelay: "400ms" }}
        >
          <div className="absolute -top-4 -left-4 w-full h-full border border-border" />
          <div className="relative bg-white border border-border p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="tag">Latest issue</span>
              <span className="font-mono text-xs text-muted">Mar 04, 2025</span>
            </div>
            <h2 className="font-display text-2xl leading-snug mb-4">
              "The tools that survived 2024 — and why we're still using them"
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-8">
              From AI coding assistants to content pipelines: a candid look at what
              actually stuck in our workflow after a year of hype.
            </p>
            <div className="flex items-center gap-4">
              {["tools", "AI", "workflow", "creator"].map((tag) => (
                <span key={tag} className="tag text-muted">{tag}</span>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
              <span className="font-mono text-xs text-muted">8 min read</span>
              <a
                href="#issues"
                className="font-mono text-xs text-ink flex items-center gap-2 hover:gap-3 transition-all"
              >
                Read issue <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className="animate-fade-up delay-500 border-t border-border pt-8 pb-16 grid grid-cols-3 md:grid-cols-4 gap-8"
        style={{ animationDelay: "500ms" }}
      >
        {[
          { num: "12K+", label: "subscribers" },
          { num: "047", label: "issues published" },
          { num: "4.9★", label: "avg rating" },
          { num: "Tues", label: "every week" },
        ].map(({ num, label }) => (
          <div key={label}>
            <div className="font-display text-3xl text-ink">{num}</div>
            <div className="font-mono text-xs text-muted mt-1 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Composed Hero with loading gate ─────────────────────────────────────────
const Hero: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Simulate a data fetch — replace this with your real async call
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return loading ? <HeroSkeleton /> : <HeroContent />;
};

export default Hero;
