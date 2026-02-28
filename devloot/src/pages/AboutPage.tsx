import React from "react";
import { Link } from "react-router-dom";

const team = [
  {
    name: "Alex Mercer",
    role: "Editor-in-chief",
    bio: "10 years building software products. Started DevLetter after getting tired of newsletters that treated developers like beginners.",
    issues: 28,
    twitter: "@alexmercer_dev",
  },
  {
    name: "Priya Nair",
    role: "Creator & Monetization",
    bio: "Content engineer, YouTube creator, newsletter operator. Writes about the business side of building an audience as a developer.",
    issues: 11,
    twitter: "@priyanair_makes",
  },
  {
    name: "Jonas Krüger",
    role: "Engineering & Tools",
    bio: "Indie developer from Berlin. 3 shipped products. Obsessive about developer tooling and TypeScript.",
    issues: 9,
    twitter: "@jonaskruger",
  },
];

const values = [
  {
    icon: "◈",
    title: "Signal over noise",
    desc: "We read 50+ sources a week so you don't have to. Every link we include earns its place. We'd rather send a shorter issue than pad it.",
  },
  {
    icon: "◇",
    title: "Treat readers as adults",
    desc: "No explainers for things developers already know. No hand-holding. We assume competence and aim to add genuine new perspective.",
  },
  {
    icon: "◉",
    title: "No ads, ever",
    desc: "DevLetter has never and will never carry display ads. We're reader-supported. Our only incentive is to be worth reading.",
  },
  {
    icon: "◐",
    title: "Candor over comfort",
    desc: "We'll tell you when something is overhyped. We'll share bad results alongside good ones. We'd rather be honest than popular.",
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="tag text-muted mb-4 inline-block">About</span>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-tight text-ink mb-6">
              We write for<br />
              <em className="italic text-muted">builders who ship.</em>
            </h1>
            <p className="font-body text-base text-muted leading-relaxed">
              DevLetter started in 2023 as a side project — a single developer's attempt to
              distill a week of reading into something worth 8 minutes of attention. It grew
              from 200 to 12,000 readers without a single paid acquisition.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "47", label: "Issues" },
              { num: "12K", label: "Readers" },
              { num: "4.9★", label: "Rating" },
              { num: "2023", label: "Founded" },
            ].map(({ num, label }) => (
              <div key={label} className="border border-border p-6">
                <p className="font-display text-4xl text-ink">{num}</p>
                <p className="font-mono text-xs text-muted mt-2 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="bg-ink text-cream border-b border-ink">
        <div className="max-w-6xl mx-auto px-8 py-20">
          <span className="font-mono text-xs tracking-widest uppercase text-cream/40 mb-6 block">
            Editorial principles
          </span>
          <h2 className="font-display text-4xl text-cream mb-16">
            How we decide<br />
            <em className="italic text-cream/50">what makes it in.</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {values.map((v) => (
              <div key={v.title} className="bg-ink p-8 hover:bg-dim transition-colors">
                <div className="text-xl text-accent mb-4">{v.icon}</div>
                <h3 className="font-display text-xl text-cream mb-3">{v.title}</h3>
                <p className="font-body text-sm text-cream/50 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-8 py-20">
          <span className="tag text-muted mb-4 inline-block">The team</span>
          <h2 className="font-display text-4xl text-ink mb-16">Who writes this</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="border border-border p-8 hover:bg-white transition-colors group">
                {/* Avatar placeholder */}
                <div className="w-12 h-12 bg-ink flex items-center justify-center font-display text-xl text-cream mb-6 group-hover:bg-dim transition-colors">
                  {member.name[0]}
                </div>
                <h3 className="font-display text-xl text-ink mb-1">{member.name}</h3>
                <p className="font-mono text-xs text-accent mb-4">{member.role}</p>
                <p className="font-body text-sm text-muted leading-relaxed mb-6">{member.bio}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="font-mono text-xs text-muted">{member.issues} issues written</span>
                  <span className="font-mono text-xs text-muted hover:text-ink transition-colors cursor-pointer">
                    {member.twitter}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="max-w-3xl mx-auto px-8 py-20">
          <span className="tag text-muted mb-4 inline-block">FAQ</span>
          <h2 className="font-display text-4xl text-ink mb-12">Common questions</h2>

          <div className="space-y-0">
            {[
              {
                q: "How often do you publish?",
                a: "Every Tuesday. We've missed two issues in two years — both announced in advance. Consistency is non-negotiable for us.",
              },
              {
                q: "Is it really free?",
                a: "Yes. The main newsletter is free. There's a paid tier for the full archive and bonus deep-dives, but the weekly issue is always free.",
              },
              {
                q: "Can I pitch a tool or product for coverage?",
                a: "We accept editorial submissions but never paid placements. If something is worth covering we'll cover it. If you're paying us, we won't.",
              },
              {
                q: "Can I republish or translate an issue?",
                a: "Drop us a note. We're generally fine with this as long as attribution is clear and you're not monetizing it.",
              },
              {
                q: "How do I write for DevLetter?",
                a: "We occasionally accept guest pieces from practitioners with real experience. Use the Post page to write a draft and send it to us.",
              },
            ].map((item, i, arr) => (
              <div
                key={i}
                className={`py-6 ${i < arr.length - 1 ? "border-b border-border" : ""}`}
              >
                <h3 className="font-display text-lg text-ink mb-3">{item.q}</h3>
                <p className="font-body text-base text-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-8 py-24 text-center">
        <h2 className="font-display text-4xl text-ink mb-4">
          Convinced?
        </h2>
        <p className="font-body text-base text-muted mb-8">
          Join 12,000 developers who read DevLetter every Tuesday.
        </p>
        <Link
          to="/"
          className="inline-block bg-ink text-cream font-mono text-xs tracking-widest uppercase px-8 py-4 hover:bg-dim transition-colors"
        >
          Subscribe — it's free →
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;
