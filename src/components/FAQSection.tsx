'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'What was the presale price for $BILL?',
    a: 'The $BILL token presale was conducted at a $100,000,000 (100M) valuation with a total supply of 10,000,000,000 (10 billion) tokens. This gives a presale price of $0.01 per $BILL token.',
  },
  {
    q: 'What are Options A, B, and C?',
    a: 'Option A gives you a full 100% refund of your original contribution plus a 5% cash bonus on top — no tokens. Option B lets you keep your full token allocation plus a 25% bonus in tokens, with a 6-month lock after TGE. Option C gives you a 50% token bonus on top of your full allocation, locked for 12 months after TGE. B and C are designed for contributors who want longer-term alignment with Billions.',
  },
  {
    q: 'When is TGE and when do tokens unlock?',
    a: 'TGE (Token Generation Event) was May 4, 2026. Option B tokens unlock 6 months later on November 4, 2026. Option C tokens unlock 12 months later on May 4, 2027.',
  },
  {
    q: 'How does the estimator calculate my allocation?',
    a: 'Your base allocation = your investment ÷ $0.01 (presale price). Option B multiplies that by 1.25× (adds 25% bonus). Option C multiplies by 1.50× (adds 50% bonus). Current value = your token count × live $BILL market price from DexScreener.',
  },
  {
    q: 'Where does the live price come from?',
    a: 'The $BILL price is fetched live from DexScreener using the official contract address (0xb1110919016846972056AB995054D65560D5f05E). It refreshes automatically every 30 seconds and selects the trading pair with the highest liquidity for accuracy.',
  },
  {
    q: 'How do I submit my option selection?',
    a: 'The selection window is open from 12:00pm UTC on Monday, April 27, 2026 to 12:00pm UTC on Monday, May 18, 2026. Submit your choice via kaito.ai/capital-launchpad. This estimator is for calculation purposes only — your submission must be done through the official portal. TGE was May 4, 2026.',
  },
  {
    q: 'Are the ROI figures guaranteed?',
    a: 'No. All value calculations are based on the live market price of $BILL and are for informational purposes only. Cryptocurrency prices are volatile and can go down as well as up. This is not financial advice. Always do your own research.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
        <h2 className="text-3xl font-bold text-white">Common Questions</h2>
      </div>

      <div className="flex flex-col gap-2">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className={`glass-card overflow-hidden transition-all duration-200 ${open === i ? 'border-amber-500/20' : ''}`}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-amber-400 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-amber-500/10 pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
