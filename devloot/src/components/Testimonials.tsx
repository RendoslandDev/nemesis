import React from "react";

const quotes = [
  {
    text: "The only newsletter I actually read the same day it lands. Dense with signal.",
    name: "Mia Hoffman",
    role: "Staff Engineer @ Vercel",
  },
  {
    text: "Finally a newsletter that treats developers like adults. No fluff, no filler.",
    name: "Jonas Krüger",
    role: "Indie developer, 3 products shipped",
  },
  {
    text: "DevLetter has become part of my Tuesday ritual. Highly curated, always relevant.",
    name: "Priya Nair",
    role: "Content engineer & YouTube creator",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="px-8 py-24 max-w-6xl mx-auto border-t border-border">
      <div className="mb-12">
        <span className="tag text-muted mb-3 inline-block">From readers</span>
        <h2 className="font-display text-4xl text-ink">What builders say</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {quotes.map((q) => (
          <blockquote key={q.name} className="border border-border p-6 bg-white/40">
            <p className="font-display text-lg italic leading-relaxed text-ink mb-6">
              "{q.text}"
            </p>
            <footer>
              <div className="font-body text-sm font-medium text-ink">{q.name}</div>
              <div className="font-mono text-xs text-muted mt-1">{q.role}</div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
