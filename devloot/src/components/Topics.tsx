import React from "react";

const topics = [
  {
    icon: "⌨",
    title: "Developer Tools",
    desc: "What's worth adding to your workflow — editors, CLIs, frameworks, and the obscure utilities that save hours.",
    count: "23 issues",
  },
  {
    icon: "✦",
    title: "AI & Automation",
    desc: "Honest takes on AI tooling for code, content, and workflows. No hype — just what's actually useful.",
    count: "18 issues",
  },
  {
    icon: "◎",
    title: "Creator Strategy",
    desc: "Growing an audience as a developer. Writing, videos, newsletters, open source. What works and why.",
    count: "15 issues",
  },
  {
    icon: "⊕",
    title: "Indie Building",
    desc: "Shipping side projects, monetization models, and the psychology of building without a team.",
    count: "21 issues",
  },
];

const Topics: React.FC = () => {
  return (
    <section id="topics" className="px-8 py-24 bg-ink text-cream">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-widest uppercase text-cream/40 mb-3 block">
            What we cover
          </span>
          <h2 className="font-display text-4xl text-cream">Four pillars,<br /><em className="italic text-cream/50">one newsletter.</em></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {topics.map((t) => (
            <div
              key={t.title}
              className="bg-ink p-8 group hover:bg-dim transition-colors cursor-default"
            >
              <div className="text-2xl mb-6 text-accent">{t.icon}</div>
              <h3 className="font-display text-xl text-cream mb-3">{t.title}</h3>
              <p className="text-sm text-cream/50 leading-relaxed mb-6">{t.desc}</p>
              <span className="font-mono text-xs text-cream/30 group-hover:text-cream/60 transition-colors">
                {t.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Topics;
