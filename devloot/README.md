# DevLetter — Newsletter Landing Page

A minimal, editorial-grade newsletter landing page for developers and content creators.  
Inspired by refined product showcase design.

## Stack

- **React 18** + **TypeScript**
- **Tailwind CSS v3**
- **Google Fonts**: Playfair Display, JetBrains Mono, DM Sans

## Getting Started

```bash
npm install
npm start
```

## Project Structure

```
src/
  components/
    Nav.tsx          — Sticky nav with scroll effect
    Hero.tsx         — Hero section with subscribe form + latest issue card
    Ticker.tsx       — Animated marquee ticker
    Issues.tsx       — Filterable issue archive grid
    IssueCard.tsx    — Individual issue card
    Topics.tsx       — Dark 4-pillar topics section
    Testimonials.tsx — Reader quotes
    CTA.tsx          — Bottom subscribe call-to-action
    Footer.tsx       — Minimal footer
  App.tsx            — Root component
  index.tsx          — Entry point
  index.css          — Tailwind base + custom animations
```

## Design Decisions

- **Palette**: Warm cream (`#F5F2ED`), deep ink (`#0D0D0D`), acid yellow accent (`#E8FF47`)
- **Typography**: Playfair Display for editorial headers, JetBrains Mono for labels/metadata, DM Sans for body
- **Aesthetic**: Editorial/magazine meets developer utility — no gradients, no blobs, just structure and type
- **Animations**: CSS-only fade-up on mount, ticker marquee, hover transitions

## Customization

Replace the sample issues in `Issues.tsx` with real data or wire up a CMS/API.  
The subscribe form is ready to connect to Mailchimp, ConvertKit, Buttondown, etc.
