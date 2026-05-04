'use client'

import { ArrowDown, Star, TrendingUp, Users } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-amber-500/10 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-cyan-500/8 blur-[80px]" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Badge */}
      <div className="relative flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 rounded-full px-4 py-2 mb-8">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 glow-dot" />
        <span className="text-sm text-amber-300 font-semibold">Presale Round 1 — Active Now</span>
      </div>

      {/* Headline */}
      <h1 className="relative text-center text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-none">
        <span className="text-white">The </span>
        <span className="gradient-text">Billions</span>
        <br />
        <span className="text-white">Presale</span>
      </h1>

      <p className="relative text-center text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
        Estimate your <span className="text-amber-400 font-semibold">$BILL</span> allocation in real-time.
        Calculate exactly how many tokens you&apos;ll receive and what they could be worth at launch.
      </p>

      {/* Trust badges */}
      <div className="relative flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Star size={14} className="text-amber-400" fill="#F59E0B" />
          <span>Audited Smart Contracts</span>
        </div>
        <div className="w-px h-4 bg-gray-700 hidden sm:block" />
        <div className="flex items-center gap-2">
          <Users size={14} className="text-amber-400" />
          <span>12,400+ Registered</span>
        </div>
        <div className="w-px h-4 bg-gray-700 hidden sm:block" />
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-amber-400" />
          <span>$2.8M Raised</span>
        </div>
      </div>

      {/* CTA */}
      <div className="relative flex flex-col sm:flex-row items-center gap-4">
        <a href="#calculator" className="btn-primary text-base px-8 py-4 rounded-xl flex items-center gap-2">
          Calculate My Allocation
          <ArrowDown size={16} />
        </a>
        <a href="#rounds" className="btn-secondary text-base px-8 py-4 rounded-xl">
          View All Rounds
        </a>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
        <span className="text-xs">Scroll to explore</span>
        <ArrowDown size={14} className="animate-bounce" />
      </div>
    </section>
  )
}
