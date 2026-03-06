import React from "react";
import SubscribeForm from "./SubscribeForm";

const CTA: React.FC = () => {
  return (
    <section id="subscribe" className="px-8 py-32 bg-cream border-t border-border">
      <div className="max-w-3xl mx-auto text-center">
        <span className="tag text-muted mb-6 inline-block">Ready?</span>
        <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-tight text-ink mb-6">
          Every Tuesday,<br />
          <em className="italic text-muted">something worth reading.</em>
        </h2>
        <p className="text-base text-muted font-body leading-relaxed mb-12 max-w-md mx-auto">
          Join 12,000 developers and creators who start their week with DevLetter.
          Free, forever. No spam. Unsubscribe in one click.
        </p>
  <div className="flex justify-center">
        <SubscribeForm
          inputClassName="bg-white sm:border-r-0 py-3.5"
          buttonClassName="px-8 py-3.5"
          center
        />
        </div>
        {/* {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="subscribe-input flex-1 border border-border sm:border-r-0 bg-white px-4 py-3.5 font-mono text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors"
            />
            <button
              type="submit"
              className="bg-ink text-cream font-mono text-xs tracking-widest uppercase px-8 py-3.5 hover:bg-dim transition-colors"
            >
              Subscribe →
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <p className="font-mono text-sm text-ink">Welcome aboard. Issue #048 drops Tuesday.</p>
          </div>
        )}*/}

      </div> 
    </section>
  );
};

export default CTA;
