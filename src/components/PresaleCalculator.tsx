'use client'

import { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'
import {
  Coins, TrendingUp, Lock, ArrowRight, Info,
  CalendarClock, BadgeDollarSign, Sparkles,
} from 'lucide-react'
import {
  OPTIONS, calcTokens, PRESALE_PRICE_USD,
  type PresaleOption,
} from '@/lib/constants'
import type { ApiResponse, BillPrice } from '@/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

// ─── Formatting ───────────────────────────────────────────────────────────────

function usd(n: number, compact = false): string {
  if (compact) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
    if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n)
}

function tokenFmt(n: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)
}

function pctFmt(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
}

function priceFmt(n: number): string {
  if (n === 0) return '$0.000000'
  if (n < 0.0001) return `$${n.toFixed(8)}`
  if (n < 1) return `$${n.toFixed(6)}`
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 4 })}`
}

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1100) {
  const [val, setVal] = useState(0)
  const prev = useRef(0)

  useEffect(() => {
    const from = prev.current
    prev.current = target
    if (target === 0) { setVal(0); return }
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4) // ease-out quart
      setVal(Math.round(from + (target - from) * eased))
      if (p < 1) requestAnimationFrame(tick)
      else setVal(target)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return val
}

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(target: Date | null) {
  const [left, setLeft] = useState<{ days: number; hours: number; mins: number } | null>(null)
  useEffect(() => {
    if (!target) return
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) { setLeft({ days: 0, hours: 0, mins: 0 }); return }
      setLeft({
        days:  Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        mins:  Math.floor((diff % 3_600_000) / 60_000),
      })
    }
    tick(); const id = setInterval(tick, 60_000); return () => clearInterval(id)
  }, [target])
  return left
}

// ─── Unlock card ─────────────────────────────────────────────────────────────

function UnlockInfo({ unlockDate }: { unlockDate: Date }) {
  const countdown = useCountdown(unlockDate)
  const isPast = unlockDate.getTime() < Date.now()

  return (
    <div className="animate-scale-in bg-gradient-to-br from-[rgba(0,70,255,0.1)] to-[rgba(0,149,255,0.06)] border border-[rgba(0,70,255,0.22)] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <CalendarClock size={16} className="text-[#0095FF]" />
        <span className="text-sm font-semibold text-white">Token Unlock</span>
        {isPast && <span className="ml-auto tag-active text-[10px]">Unlocked ✓</span>}
      </div>
      <div className="text-lg font-bold text-[#3EFFC8] mb-3">
        {unlockDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
      {!isPast && countdown && (
        <div className="flex gap-3">
          {[{ v: countdown.days, u: 'days' }, { v: countdown.hours, u: 'hrs' }, { v: countdown.mins, u: 'min' }].map(({ v, u }) => (
            <div key={u} className="flex-1 bg-[#070A18]/70 rounded-lg py-2 text-center">
              <div className="text-xl font-mono font-black text-white">{String(v).padStart(2, '0')}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{u}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Price scenario table ─────────────────────────────────────────────────────

function ReturnTable({ tokens, presaleInvestment }: { tokens: number; presaleInvestment: number }) {
  const rows = [
    { label: '$0.005', tag: '–50%', price: 0.005 },
    { label: '$0.01',  tag: 'presale', price: 0.01, isEntry: true },
    { label: '$0.02',  tag: '2×',   price: 0.02 },
    { label: '$0.05',  tag: '5×',   price: 0.05 },
    { label: '$0.10',  tag: '10×',  price: 0.10 },
    { label: '$0.50',  tag: '50×',  price: 0.50 },
    { label: '$1.00',  tag: '100×', price: 1.00 },
  ]
  return (
    <div className="animate-fade-in-up glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-[#3EFFC8]" />
        <span className="text-sm font-bold text-white">Price Scenarios</span>
        <span className="ml-auto text-[10px] text-gray-600 italic">not financial advice</span>
      </div>
      <div className="space-y-1.5">
        {rows.map(r => {
          const value = tokens * r.price
          const roi = ((value - presaleInvestment) / presaleInvestment) * 100
          return (
            <div
              key={r.price}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                r.isEntry
                  ? 'bg-[rgba(0,70,255,0.12)] border border-[rgba(0,70,255,0.25)]'
                  : 'bg-[#070A18]/60 hover:bg-[rgba(0,70,255,0.05)]'
              }`}
            >
              <span className={`font-mono text-xs w-14 ${r.isEntry ? 'text-[#0095FF]' : 'text-gray-600'}`}>
                {r.label}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                r.isEntry ? 'bg-[#0046FF]/20 text-[#0095FF]' : 'text-gray-600'
              }`}>
                {r.tag}
              </span>
              <span className="font-bold text-white">{usd(value, true)}</span>
              <span className={`text-xs font-semibold w-16 text-right ${roi >= 0 ? 'text-[#3EFFC8]' : 'text-red-400'}`}>
                {pctFmt(roi)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PresaleCalculator() {
  const [investment, setInvestment] = useState('')
  const [selectedOption, setSelectedOption] = useState<PresaleOption>('C')
  const [prevTokens, setPrevTokens] = useState(0)

  const { data: priceData, isLoading: priceLoading } = useSWR<ApiResponse<BillPrice>>(
    '/api/price', fetcher, { refreshInterval: 30_000 }
  )

  const currentPrice = priceData?.data?.price ?? null
  const investmentNum = parseFloat(investment) || 0
  const option = OPTIONS.find(o => o.id === selectedOption)!
  const tokens = calcTokens(investmentNum, selectedOption)
  const baseTokens = investmentNum / PRESALE_PRICE_USD
  const bonusTokens = tokens - baseTokens
  const currentValue = currentPrice != null ? tokens * currentPrice : null
  const roi = currentValue != null && investmentNum > 0
    ? ((currentValue - investmentNum) / investmentNum) * 100 : null
  const hasResult = investmentNum > 0 && selectedOption !== 'A'

  // trigger count-up when tokens change
  useEffect(() => { setPrevTokens(tokens) }, [tokens])
  const animatedTokens = useCountUp(tokens)
  const animatedBonus  = useCountUp(bonusTokens)
  const animatedBase   = useCountUp(baseTokens)

  const optStyle = {
    A: {
      idle:   'border-gray-700/40 hover:border-gray-600/60',
      active: 'border-gray-500/60 bg-gradient-to-br from-gray-800/30 to-gray-900/20',
      badge:  'bg-gray-700 text-gray-300',
      glow:   '',
    },
    B: {
      idle:   'border-[rgba(0,149,255,0.18)] hover:border-[rgba(0,149,255,0.4)]',
      active: 'border-[#0095FF]/50 bg-gradient-to-br from-[rgba(0,149,255,0.1)] to-[rgba(0,70,255,0.05)]',
      badge:  'bg-[rgba(0,149,255,0.2)] text-[#0095FF]',
      glow:   'shadow-[0_0_20px_rgba(0,149,255,0.15)]',
    },
    C: {
      idle:   'border-[rgba(0,70,255,0.18)] hover:border-[rgba(0,70,255,0.4)]',
      active: 'border-[#0046FF]/60 bg-gradient-to-br from-[rgba(0,70,255,0.12)] to-[rgba(62,255,200,0.04)]',
      badge:  'bg-[rgba(0,70,255,0.25)] text-[#3EFFC8]',
      glow:   'shadow-[0_0_24px_rgba(0,70,255,0.2)]',
    },
  }

  return (
    <section id="calculator" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Section label */}
      <div className="text-center mb-8 animate-fade-in">
        <p className="text-[#0095FF] text-xs font-bold uppercase tracking-widest mb-2">
          Real-Time Calculator
        </p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-[#0046FF] to-[#3EFFC8] mx-auto rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Left: inputs ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Investment input */}
          <div className="animate-fade-in-up glass-card p-6">
            <label className="label-text">💰 Your Investment</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
              <input
                type="number"
                value={investment}
                onChange={e => setInvestment(e.target.value)}
                placeholder="0.00"
                min="0"
                step="any"
                className="input-field pl-8 text-2xl font-black placeholder:font-normal placeholder:text-2xl"
              />
            </div>
            {investmentNum > 0 && (
              <p className="text-xs text-gray-600 mt-2 animate-fade-in">
                At $0.01/token →{' '}
                <span className="text-[#0095FF] font-semibold">
                  {tokenFmt(investmentNum / PRESALE_PRICE_USD)} base tokens
                </span>
              </p>
            )}
          </div>

          {/* Option selector */}
          <div className="animate-fade-in-up delay-100 glass-card p-6">
            <label className="label-text">🎭 Your Presale Option</label>
            <div className="flex flex-col gap-3">
              {OPTIONS.map(opt => {
                const s = optStyle[opt.id]
                const isSelected = selectedOption === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                      isSelected ? `${s.active} ${s.glow}` : s.idle
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg ${s.badge}`}>
                        {opt.short}
                      </span>
                      {opt.lockMonths && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-500">
                          <Lock size={9} />{opt.lockMonths}-month lock
                        </span>
                      )}
                      {isSelected && (
                        <span className="ml-auto text-[10px] text-[#3EFFC8] font-bold animate-fade-in">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-white leading-tight">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{opt.description}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Right: results ───────────────────────────────────────────── */}
        <div className="lg:col-span-3 flex flex-col gap-5">

          {/* Option A */}
          {selectedOption === 'A' ? (
            <div className="animate-scale-in glass-card p-8 flex flex-col gap-5 border-gray-600/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-700/30 flex items-center justify-center">
                  <BadgeDollarSign size={20} className="text-gray-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Full Refund + 5% Bonus</h3>
                  <p className="text-gray-500 text-xs mt-0.5">No $BILL tokens — capital returned</p>
                </div>
              </div>
              {investmentNum > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#070A18]/60 rounded-xl p-4 border border-gray-800/40">
                      <div className="text-xs text-gray-500 mb-1">Investment</div>
                      <div className="text-xl font-bold text-white">{usd(investmentNum)}</div>
                    </div>
                    <div className="bg-[rgba(62,255,200,0.08)] border border-[rgba(62,255,200,0.2)] rounded-xl p-4">
                      <div className="text-xs text-gray-500 mb-1">5% cash bonus</div>
                      <div className="text-xl font-bold text-[#3EFFC8]">+{usd(investmentNum * 0.05)}</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[rgba(0,70,255,0.08)] to-[rgba(0,149,255,0.04)] border border-[rgba(0,70,255,0.2)] rounded-xl p-6 text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Total Refund</div>
                    <div className="text-5xl font-black text-white">{usd(investmentNum * 1.05)}</div>
                    <div className="text-xs text-gray-600 mt-2">returned to your wallet</div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-600 text-sm">
                  Enter your investment amount to see your refund total
                </div>
              )}
            </div>

          ) : !hasResult ? (
            /* Empty state */
            <div className="glass-card p-12 flex flex-col items-center justify-center min-h-[320px] border-dashed border-[rgba(0,70,255,0.15)] gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(0,70,255,0.08)] flex items-center justify-center">
                <Sparkles size={28} className="text-[#0046FF]/40" />
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">Enter your investment amount</p>
                <p className="text-gray-600 text-xs mt-1">to calculate your $BILL allocation</p>
              </div>
            </div>

          ) : (
            <>
              {/* Allocation card */}
              <div className={`animate-scale-in glass-card p-6 result-glow ${
                selectedOption === 'C'
                  ? 'border-[rgba(0,70,255,0.45)] shadow-[0_0_50px_rgba(0,70,255,0.1)]'
                  : 'border-[rgba(0,149,255,0.35)] shadow-[0_0_40px_rgba(0,149,255,0.08)]'
              }`}>

                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(0,70,255,0.15)] flex items-center justify-center">
                    <Coins size={16} className="text-[#0046FF]" />
                  </div>
                  <h3 className="font-bold text-white">Your Allocation</h3>
                  <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-lg ${
                    selectedOption === 'C'
                      ? 'bg-[rgba(0,70,255,0.2)] text-[#3EFFC8]'
                      : 'bg-[rgba(0,149,255,0.15)] text-[#0095FF]'
                  }`}>
                    {option.short}
                  </span>
                </div>

                {/* Big token number with count-up */}
                <div className="mb-6 py-4 px-4 rounded-xl bg-gradient-to-br from-[rgba(0,70,255,0.08)] to-transparent border border-[rgba(0,70,255,0.12)]">
                  <div className="text-[3.2rem] sm:text-[4rem] font-black leading-none gradient-text tabular-nums">
                    {tokenFmt(animatedTokens)}
                  </div>
                  <div className="text-lg text-gray-400 font-semibold mt-1">$BILL tokens</div>
                </div>

                {/* Breakdown grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-[#070A18]/70 rounded-xl p-3.5">
                    <div className="text-xs text-gray-500 mb-1">Base tokens</div>
                    <div className="font-bold text-white tabular-nums">{tokenFmt(animatedBase)}</div>
                  </div>
                  <div className="bg-[rgba(62,255,200,0.06)] border border-[rgba(62,255,200,0.15)] rounded-xl p-3.5">
                    <div className="text-xs text-gray-500 mb-1">
                      Bonus ({option.bonusMultiplier === 1.25 ? '25%' : '50%'})
                    </div>
                    <div className="font-bold text-[#3EFFC8] tabular-nums">+{tokenFmt(animatedBonus)}</div>
                  </div>
                  <div className="bg-[#070A18]/70 rounded-xl p-3.5">
                    <div className="text-xs text-gray-500 mb-1">Invested</div>
                    <div className="font-bold text-white">{usd(investmentNum)}</div>
                  </div>
                  <div className="bg-[#070A18]/70 rounded-xl p-3.5">
                    <div className="text-xs text-gray-500 mb-1">Entry price</div>
                    <div className="font-bold text-gray-400">$0.0100 / BILL</div>
                  </div>
                </div>

                {/* Current value */}
                <div className={`rounded-xl p-4 transition-all ${
                  currentValue != null
                    ? roi != null && roi >= 0
                      ? 'bg-[rgba(62,255,200,0.07)] border border-[rgba(62,255,200,0.2)]'
                      : 'bg-red-500/7 border border-red-500/20'
                    : 'bg-gray-800/30 border border-gray-700/30'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Current Value</div>
                      {priceLoading ? (
                        <div className="h-8 w-36 rounded-lg shimmer" />
                      ) : currentValue != null ? (
                        <div className="text-3xl font-black text-white">{usd(currentValue)}</div>
                      ) : (
                        <div className="text-sm text-gray-500 mt-1">Price unavailable</div>
                      )}
                    </div>
                    {roi != null && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">ROI</div>
                        <div className={`text-2xl font-black ${roi >= 0 ? 'text-[#3EFFC8]' : 'text-red-400'}`}>
                          {pctFmt(roi)}
                        </div>
                      </div>
                    )}
                  </div>
                  {currentPrice != null && (
                    <p className="text-xs text-gray-600 mt-2">
                      {priceFmt(currentPrice)} × {tokenFmt(tokens)} tokens
                    </p>
                  )}
                </div>
              </div>

              {/* Unlock countdown */}
              {option.unlockDate && <UnlockInfo unlockDate={option.unlockDate} />}

              {/* Fine print */}
              <div className="animate-fade-in flex items-start gap-3 bg-[rgba(0,70,255,0.04)] border border-[rgba(0,70,255,0.1)] rounded-xl px-4 py-3">
                <Info size={13} className="text-gray-700 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  TGE: May 4, 2026 · Selection window: Apr 27 – May 18, 2026 via{' '}
                  <a href="https://kaito.ai/capital-launchpad" target="_blank" rel="noopener noreferrer"
                    className="text-[#0095FF]/80 hover:text-[#0095FF] underline">
                    kaito.ai/capital-launchpad
                  </a>
                </p>
              </div>
            </>
          )}

          {/* Scenario table */}
          {hasResult && <ReturnTable tokens={tokens} presaleInvestment={investmentNum} />}
        </div>
      </div>

      {/* Option comparison pills */}
      {hasResult && (
        <div className="mt-8 animate-fade-in-up">
          <p className="text-center text-xs text-gray-600 mb-3 uppercase tracking-widest">Compare options</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {OPTIONS.filter(o => o.id !== 'A').map(o => {
              const t = calcTokens(investmentNum, o.id)
              const v = currentPrice != null ? t * currentPrice : null
              const isSelected = o.id === selectedOption
              return (
                <button
                  key={o.id}
                  onClick={() => setSelectedOption(o.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 ${
                    isSelected
                      ? 'border-[#0046FF]/70 bg-[rgba(0,70,255,0.12)] text-white shadow-[0_0_16px_rgba(0,70,255,0.2)]'
                      : 'border-gray-700/40 text-gray-500 hover:border-[rgba(0,70,255,0.3)] hover:text-gray-300'
                  }`}
                >
                  <span className="font-bold">{o.short}</span>
                  <ArrowRight size={12} />
                  <span className="font-mono text-xs">{tokenFmt(t)}</span>
                  {v != null && (
                    <span className={`text-xs ml-1 ${isSelected ? 'text-[#3EFFC8]' : 'text-gray-600'}`}>
                      ({usd(v, true)})
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
