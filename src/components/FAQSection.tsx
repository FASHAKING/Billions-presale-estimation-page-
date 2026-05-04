'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'What is $BILL and what does Billions do?',
    a: '$BILL is the native utility and governance token of the Billions protocol — a decentralized platform designed to bring institutional-grade wealth strategies to everyday users. Token holders gain access to premium features, fee discounts, and governance voting rights.',
  },
  {
    q: 'How does the presale allocation work?',
    a: 'You choose a presale round, input your investment amount in ETH, BNB, USDT, or USDC, and the calculator shows your exact $BILL allocation. Earlier rounds have lower prices — buying in Pre-Sale Round 1 gets you tokens at $0.0004 vs $0.001 at public sale.',
  },
  {
    q: 'Are the potential return figures guaranteed?',
    a: 'No. The potential return estimates (2x, 5x, 10x, etc.) are purely illustrative scenarios to help you understand how your investment could perform at different price levels. Cryptocurrency investments are highly speculative and you may lose your entire investment.',
  },
  {
    q: 'What currencies can I use to invest?',
    a: 'We accept ETH (Ethereum), BNB (Binance Smart Chain), USDT (Tether), and USDC (USD Coin). The calculator uses live exchange rates to show you your exact $BILL allocation in real-time.',
  },
  {
    q: 'When will I receive my $BILL tokens?',
    a: 'Tokens are distributed within 48 hours of the public sale closing. Presale participants receive their allocation first, followed by a 6-month linear vesting schedule to ensure long-term price stability.',
  },
  {
    q: 'Is there a minimum or maximum investment?',
    a: 'Each round has different limits. Pre-Sale Round 1 allows between $100 and $50,000 USD equivalent. Limits vary by round to ensure fair distribution across the community.',
  },
  {
    q: 'How do I know this is legitimate?',
    a: 'Our smart contracts are audited by a reputable third-party firm. Registration here captures your interest — no payment is collected on this site. Actual payment instructions are sent via verified email with official contract addresses.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Got Questions?
        </p>
        <h2 className="section-title">Frequently Asked Questions</h2>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-3">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className={`glass-card overflow-hidden transition-all duration-200 ${
              open === i ? 'border-amber-500/25' : ''
            }`}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-amber-400 transition-transform duration-200 ${
                  open === i ? 'rotate-180' : ''
                }`}
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
