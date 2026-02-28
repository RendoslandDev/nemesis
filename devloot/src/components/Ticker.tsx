import React from "react";

const items = [
  "WEEKLY DISPATCH",
  "FOR BUILDERS & CREATORS",
  "CODE · TOOLS · CRAFT",
  "EVERY TUESDAY",
  "47 ISSUES PUBLISHED",
  "12,000+ READERS",
  "NO ADS · NO FLUFF",
  "JUST SIGNAL",
];

const Ticker: React.FC = () => {
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrap py-3 bg-ink text-cream">
      <div className="ticker-content">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6 font-mono text-xs tracking-widest uppercase text-cream/70">
            <span className="w-1 h-1 rounded-full bg-accent inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
