import React, { useState } from "react";

const Hero: React.FC = () => {
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
    // {featuring my matter nemesis in the hero section, because why not?}
  );
};

export default Hero;
