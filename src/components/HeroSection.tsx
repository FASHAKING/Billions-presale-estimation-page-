'use client'

import BillionsLogo from './BillionsLogo'

const STATS = [
  { label: 'Presale Price', value: '$0.01', sub: 'per $BILL' },
  { label: 'Total Supply',  value: '10B',   sub: '$BILL tokens' },
  { label: 'TGE Date',      value: 'May 4', sub: '2026' },
  { label: 'Network',       value: 'BNB',   sub: 'Chain' },
]

export default function HeroSection() {
  return (
    <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6 text-center">

      {/* Floating logo */}
      <div className="float-logo inline-block mb-6 animate-fade-in">
        <div className="relative inline-block">
          <div className="absolute inset-0 rounded-2xl bg-[#0046FF]/30 blur-2xl scale-110" />
          <BillionsLogo size={72} />
        </div>
      </div>

      {/* Live badge */}
      <div className="animate-fade-in delay-100 flex justify-center mb-5">
        <div className="inline-flex items-center gap-2 bg-[rgba(0,70,255,0.1)] border border-[rgba(0,70,255,0.25)] rounded-full px-4 py-1.5">
          <span className="w-2 h-2 rounded-full bg-[#3EFFC8] glow-dot" />
          <span className="text-sm text-[#3EFFC8] font-semibold tracking-wide">
            $BILL Token — Live on BNB Chain
          </span>
        </div>
      </div>

      {/* Headline */}
      <h1 className="animate-fade-in-up delay-150 text-5xl sm:text-6xl md:text-7xl font-black leading-none mb-4">
        <span className="gradient-text-animated">Billions</span>
        <br />
        <span className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
          Presale Estimator
        </span>
      </h1>

      {/* Subtitle */}
      <p className="animate-fade-in-up delay-300 text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
        Enter your investment and the option you chose — see your{' '}
        <span className="text-white font-semibold">exact $BILL allocation</span> and its{' '}
        <span className="text-[#3EFFC8] font-semibold">live market value</span> instantly.
      </p>

      {/* Stats strip */}
      <div className="animate-fade-in-up delay-400 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-10">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="glass-card-hover px-4 py-4 text-center"
            style={{ animationDelay: `${400 + i * 80}ms` }}
          >
            <div className="text-2xl font-black text-white leading-none mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className="text-[10px] text-gray-600">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="animate-fade-in delay-600">
        <a
          href="#calculator"
          className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4 rounded-xl"
        >
          Calculate My Allocation
          <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  )
}
