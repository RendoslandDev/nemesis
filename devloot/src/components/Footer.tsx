import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border px-8 py-10 bg-ink text-cream/40">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs tracking-widest uppercase">
          DEV<span className="text-cream/20 tracking-wider">LOOT</span>
          <span className="ml-3 text-cream/20">© 2026</span>
        </span>
        <div className="flex items-center gap-8 font-mono text-xs">
          <a href="#" className="hover:text-cream/80 transition-colors">Archive</a>
          <a href="#" className="hover:text-cream/80 transition-colors">Twitter</a>
          <a href="#" className="hover:text-cream/80 transition-colors">RSS</a>
          <a href="#" className="hover:text-cream/80 transition-colors">Unsubscribe</a>
        </div>
        <div className="flex gap-2 tracking-[0.3em] text-sm">Developed by NEMESIS <img src="/rendo.jpeg" alt="nemisis" className="rounded-full border px-2 py-2 Object-fit w-10"/></div>
      </div>
    </footer>
  );
};

export default Footer;
