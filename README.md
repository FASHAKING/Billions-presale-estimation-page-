# Billions Presale Estimator

A real-time presale allocation estimator for the **$BILL token** by [Billions Network](https://kaito.ai/capital-launchpad). Enter your investment amount and select your presale option to instantly see your exact token allocation and its live market value.

---

## What It Does

During the Billions presale, participants chose one of three options for how their capital would be treated at TGE (Token Generation Event). This tool lets you:

- **Input** your total investment in USD
- **Select** which presale option you chose (A, B, or C)
- **Instantly see** your token allocation with bonuses applied
- **Track the live value** of your allocation using the real-time $BILL price from DexScreener

---

## Presale Options

| Option | Description | Token Bonus | Capital Bonus | Lock Period |
|--------|-------------|-------------|---------------|-------------|
| **A** | Full refund + cash bonus | No tokens | +5% cash on investment | None |
| **B** | Full allocation + bonus tokens | +25% bonus tokens | None | 6 months post-TGE (unlocks Nov 4, 2026) |
| **C** | Full allocation + max bonus tokens | +50% bonus tokens | None | 12 months post-TGE (unlocks May 4, 2027) |

**Presale price:** $0.01 per $BILL  
**Total supply:** 10,000,000,000 $BILL  
**TGE Date:** May 4, 2026  
**Network:** BNB Chain  
**Contract:** `0xDf24f8c21Cb404B3031a450D8e049D6E39FC1fA5`

---

## Features

- **Live $BILL price** — fetched from DexScreener every 30 seconds, no stale data
- **Animated count-up** — token numbers animate smoothly when results appear
- **Unlock countdown** — live countdown timer to your option's unlock date
- **Return table** — shows portfolio value at 2x, 5x, 10x, 25x, 50x price scenarios
- **Scroll-aware navbar** — glass effect deepens as you scroll
- **Fully animated UI** — fade-in, float, shimmer, glow-pulse, gradient-shift animations throughout
- **Mobile responsive** — works on all screen sizes
- **Vercel-optimized** — uses Next.js CDN revalidation (30s) instead of in-memory cache, works correctly across serverless invocations

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom CSS animations |
| Data fetching | SWR with 30s auto-refresh |
| Price feed | DexScreener API |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── api/price/route.ts    # DexScreener proxy with 30s CDN revalidation
│   ├── globals.css            # Design system: tokens, component classes, keyframes
│   ├── layout.tsx
│   └── page.tsx               # Root page, animated background blobs
├── components/
│   ├── BillionsLogo.tsx       # Official "00" goggle-mask SVG brand icon
│   ├── FAQSection.tsx         # Accordion FAQ
│   ├── Footer.tsx             # Brand footer with fashaking credit
│   ├── HeroSection.tsx        # Animated hero: logo, badge, headline, stats strip, CTA
│   ├── Navbar.tsx             # Scroll-aware glass navbar with mobile menu
│   ├── PriceBanner.tsx        # Sticky live price bar with 24h change, FDV, liquidity
│   └── PresaleCalculator.tsx  # Core calculator: option cards, count-up results, return table
├── lib/
│   └── constants.ts           # Single source of truth: prices, dates, option configs, calcTokens()
└── types/
    └── index.ts               # BillPrice, ApiResponse types
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

```bash
git clone https://github.com/fashaking/billions-presale-estimation-page-.git
cd billions-presale-estimation-page-
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Deploy — no environment variables required

The price API route uses `next: { revalidate: 30 }` for Vercel's CDN cache, so it renders as a static route with automatic 30-second background revalidation. No cold-start cache misses.

---

## Calculation Logic

```
base_tokens = investment_usd / 0.01

Option A → 0 tokens, cash_refund = investment × 1.05
Option B → tokens = base_tokens × 1.25
Option C → tokens = base_tokens × 1.50

live_value = tokens × current_bill_price
```

---

## Brand

Colors follow the official Billions Network brand palette:

| Token | Hex |
|-------|-----|
| Primary Blue | `#0046FF` |
| Cyan | `#3EFFC8` |
| Light Blue | `#0095FF` |
| Dark Navy | `#070A18` |
| Card | `#0C1029` |

---

Built with ❤️ for the Billions Community by [fashaking](https://x.com/FASHAKING3)

*This tool is for estimation purposes only and does not constitute financial advice. Token prices are volatile. Data sourced from DexScreener.*
