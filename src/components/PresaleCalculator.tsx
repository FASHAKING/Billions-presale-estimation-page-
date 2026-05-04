'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import {
  Coins, TrendingUp, Lock, ArrowRight, Info,
  CalendarClock, BadgeDollarSign, Zap,
} from 'lucide-react'
import {
  OPTIONS, calcTokens, PRESALE_PRICE_USD,
  type PresaleOption,
} from '@/lib/constants'
import type { ApiResponse, BillPrice } from '@/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

// ─── Formatting helpers ───────────────────────────────────────────────────────

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
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

function priceFmt(n: number): string {
  if (n === 0) return '$0.000000'
  if (n < 0.0001) return `$${n.toFixed(8)}`
  if (n < 1) return `$${n.toFixed(6)}`
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 4 })}`
}

// ─── Countdown ───────────────────────────────────────────────────────────────

function useCountdown(target: Date | null) {
  const [left, setLeft] = useState<{ days: number; hours: number; mins: number } | null>(null)

  useEffect(() => {
    if (!target) return
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) { setLeft({ days: 0, hours: 0, mins: 0 }); return }
      setLeft({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        mins: Math.floor((diff % 3_600_000) / 60_000),
      })
    }
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [target])

  return left
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function UnlockInfo({ unlockDate }: { unlockDate: Date }) {
  const countdown = useCountdown(unlockDate)
  const isPast = unlockDate.getTime() < Date.now()

  return (
    <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <CalendarClock size={16} className="text-amber-400" />
        <span className="text-sm font-semibold text-white">Token Unlock</span>
        {isPast && <span className="ml-auto tag-active text-[10px]">Unlocked</span>}
      </div>
      <div className="text-base font-bold text-amber-400 mb-2">
        {unlockDate.toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric',
        })}
      </div>
      {!isPast && countdown && (
        <div className="flex gap-4">
          {[
            { v: countdown.days, u: 'days' },
            { v: countdown.hours, u: 'hrs' },
            { v: countdown.mins, u: 'min' },
          ].map(({ v, u }) => (
            <div key={u} className="text-center">
              <div className="text-xl font-mono font-bold text-white">{String(v).padStart(2, '0')}</div>
              <div className="text-[10px] text-gray-500 uppercase">{u}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReturnTable({
  tokens,
  presaleInvestment,
}: {
  tokens: number
  presaleInvestment: number
}) {
  const targets = [
    { label: '0.005 (–50%)', price: 0.005 },
    { label: '0.01 (presale)', price: 0.01 },
    { label: '0.02 (2×)', price: 0.02 },
    { label: '0.05 (5×)', price: 0.05 },
    { label: '0.10 (10×)', price: 0.10 },
    { label: '0.50 (50×)', price: 0.50 },
    { label: '1.00 (100×)', price: 1.00 },
  ]

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-emerald-400" />
        <h3 className="text-sm font-bold text-white">Price Scenarios</h3>
        <span className="ml-auto text-[10px] text-gray-600">not financial advice</span>
      </div>
      <div className="space-y-1.5">
        {targets.map(t => {
          const value = tokens * t.price
          const roi = ((value - presaleInvestment) / presaleInvestment) * 100
          const isPositive = roi >= 0
          return (
            <div
              key={t.price}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                t.price === 0.01 ? 'bg-gray-800/60 border border-gray-700/40' : 'bg-[#0D0D1A]/60'
              }`}
            >
              <span className="text-gray-500 font-mono text-xs w-28">${t.label}</span>
              <span className="font-bold text-white">{usd(value, true)}</span>
              <span className={`text-xs font-semibold w-20 text-right ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {pctFmt(roi)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main calculator ──────────────────────────────────────────────────────────

export default function PresaleCalculator() {
  const [investment, setInvestment] = useState('')
  const [selectedOption, setSelectedOption] = useState<PresaleOption>('C')

  const { data: priceData, isLoading: priceLoading } = useSWR<ApiResponse<BillPrice>>(
    '/api/price',
    fetcher,
    { refreshInterval: 30_000 }
  )

  const currentPrice = priceData?.data?.price ?? null
  const investmentNum = parseFloat(investment) || 0

  const option = OPTIONS.find(o => o.id === selectedOption)!
  const tokens = calcTokens(investmentNum, selectedOption)
  const baseTokens = investmentNum / PRESALE_PRICE_USD
  const bonusTokens = tokens - baseTokens
  const currentValue = currentPrice != null ? tokens * currentPrice : null
  const roi = currentValue != null && investmentNum > 0
    ? ((currentValue - investmentNum) / investmentNum) * 100
    : null

  const hasResult = investmentNum > 0 && selectedOption !== 'A'

  return (
    <section id="calculator" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Billions Presale
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          Estimate Your<br />
          <span className="gradient-text">$BILL Allocation</span>
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-base">
          Enter your investment amount and which option you chose to see your
          token allocation and real-time value.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Input panel (2/5) ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Investment amount */}
          <div className="glass-card p-6">
            <label className="label-text">Your Investment</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
              <input
                type="number"
                value={investment}
                onChange={e => setInvestment(e.target.value)}
                placeholder="0.00"
                min="0"
                step="any"
                className="input-field pl-8 text-xl font-bold placeholder:font-normal"
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Presale price: <span className="text-gray-400">$0.01 / $BILL</span>
              {investmentNum > 0 && (
                <span className="ml-2 text-amber-500/80">
                  → base: {tokenFmt(investmentNum / PRESALE_PRICE_USD)} tokens
                </span>
              )}
            </p>
          </div>

          {/* Option selector */}
          <div className="glass-card p-6">
            <label className="label-text">Your Presale Option</label>
            <div className="flex flex-col gap-3">
              {OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    selectedOption === opt.id
                      ? opt.id === 'A'
                        ? 'border-gray-500/60 bg-gray-500/10'
                        : opt.id === 'B'
                        ? 'border-blue-500/60 bg-blue-500/8'
                        : 'border-amber-500/60 bg-amber-500/10'
                      : 'border-gray-700/40 hover:border-gray-600/60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      opt.id === 'A'
                        ? 'bg-gray-700 text-gray-300'
                        : opt.id === 'B'
                        ? 'bg-blue-900/60 text-blue-300'
                        : 'bg-amber-900/60 text-amber-300'
                    }`}>
                      {opt.short}
                    </span>
                    {opt.lockMonths && (
                      <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-500">
                        <Lock size={9} />
                        {opt.lockMonths}mo lock
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white">{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results panel (3/5) ── */}
        <div className="lg:col-span-3 flex flex-col gap-5">

          {selectedOption === 'A' ? (
            /* Option A — refund + 5% bonus */
            <div className="glass-card p-8 flex flex-col gap-5 border-gray-500/25">
              <div className="flex items-center gap-3">
                <BadgeDollarSign size={22} className="text-gray-300" />
                <div>
                  <h3 className="text-lg font-bold text-white">Full Refund + 5% Bonus</h3>
                  <p className="text-gray-500 text-xs mt-0.5">No $BILL tokens — capital returned with bonus</p>
                </div>
              </div>

              {investmentNum > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0D0D1A]/60 rounded-xl p-4">
                      <div className="text-xs text-gray-500 mb-1">Original investment</div>
                      <div className="text-xl font-bold text-white">{usd(investmentNum)}</div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                      <div className="text-xs text-gray-500 mb-1">5% bonus</div>
                      <div className="text-xl font-bold text-emerald-400">+{usd(investmentNum * 0.05)}</div>
                    </div>
                  </div>
                  <div className="bg-gray-700/20 border border-gray-500/30 rounded-xl p-5 text-center">
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Total refund</div>
                    <div className="text-4xl font-black text-white">{usd(investmentNum * 1.05)}</div>
                    <div className="text-xs text-gray-600 mt-1">returned to your wallet</div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-gray-600 text-sm">
                  Enter your investment amount above to see your refund total
                </div>
              )}
            </div>
          ) : !hasResult ? (
            /* Placeholder */
            <div className="glass-card p-10 flex flex-col items-center justify-center min-h-[300px] border-dashed gap-4">
              <Zap size={36} className="text-amber-400/30" />
              <p className="text-gray-600 text-sm text-center max-w-40">
                Enter your investment amount to see your allocation
              </p>
            </div>
          ) : (
            <>
              {/* Allocation card */}
              <div className={`glass-card p-6 ${
                selectedOption === 'C'
                  ? 'border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.07)]'
                  : 'border-blue-500/25'
              }`}>
                <div className="flex items-center gap-2 mb-5">
                  <Coins size={18} className="text-amber-400" />
                  <h3 className="font-bold text-white">Your Allocation</h3>
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-lg ${
                    selectedOption === 'C'
                      ? 'bg-amber-500/15 text-amber-300'
                      : 'bg-blue-500/15 text-blue-300'
                  }`}>
                    {option.short}
                  </span>
                </div>

                {/* Big token number */}
                <div className="mb-5">
                  <div className="text-5xl font-black gradient-text leading-none">
                    {tokenFmt(tokens)}
                  </div>
                  <div className="text-xl text-gray-400 font-semibold mt-1">$BILL tokens</div>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-[#0D0D1A]/60 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">Base allocation</div>
                    <div className="font-bold text-white">{tokenFmt(baseTokens)}</div>
                  </div>
                  <div className="bg-[#0D0D1A]/60 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">
                      Bonus ({option.bonusMultiplier === 1.25 ? '25%' : '50%'})
                    </div>
                    <div className="font-bold text-emerald-400">+{tokenFmt(bonusTokens)}</div>
                  </div>
                  <div className="bg-[#0D0D1A]/60 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">Invested</div>
                    <div className="font-bold text-white">{usd(investmentNum)}</div>
                  </div>
                  <div className="bg-[#0D0D1A]/60 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">Entry price</div>
                    <div className="font-bold text-gray-300">$0.0100</div>
                  </div>
                </div>

                {/* Current value */}
                <div className={`rounded-xl p-4 ${
                  currentValue != null
                    ? roi != null && roi >= 0
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : 'bg-red-500/10 border border-red-500/20'
                    : 'bg-gray-700/20 border border-gray-700/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Current Value</div>
                      {priceLoading ? (
                        <div className="h-7 w-32 rounded bg-gray-700 animate-pulse" />
                      ) : currentValue != null ? (
                        <div className="text-2xl font-black text-white">{usd(currentValue)}</div>
                      ) : (
                        <div className="text-sm text-gray-500">Price unavailable</div>
                      )}
                    </div>
                    {roi != null && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">ROI</div>
                        <div className={`text-xl font-black ${roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {pctFmt(roi)}
                        </div>
                      </div>
                    )}
                  </div>

                  {currentPrice != null && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600">
                      <span>{priceFmt(currentPrice)} × {tokenFmt(tokens)} tokens</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Unlock info */}
              {option.unlockDate && <UnlockInfo unlockDate={option.unlockDate} />}

              {/* Lock info */}
              <div className="flex items-start gap-3 glass-card px-4 py-3">
                <Info size={14} className="text-gray-600 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your tokens are locked and will be released on the unlock date above.
                  Selection window: Apr 27 – May 18, 2026 via{' '}
                  <a
                    href="https://kaito.ai/capital-launchpad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500/70 hover:text-amber-400 underline"
                  >
                    kaito.ai/capital-launchpad
                  </a>
                </p>
              </div>
            </>
          )}

          {/* Price scenario table — always show once investment entered */}
          {hasResult && <ReturnTable tokens={tokens} presaleInvestment={investmentNum} />}
        </div>
      </div>

      {/* Comparison pill — show if B/C selected and result visible */}
      {hasResult && (
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {OPTIONS.filter(o => o.id !== 'A').map(o => {
            const t = calcTokens(investmentNum, o.id)
            const v = currentPrice != null ? t * currentPrice : null
            const isSelected = o.id === selectedOption
            return (
              <button
                key={o.id}
                onClick={() => setSelectedOption(o.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${
                  isSelected
                    ? 'border-amber-500/60 bg-amber-500/10 text-white'
                    : 'border-gray-700/40 text-gray-500 hover:border-gray-600/60'
                }`}
              >
                <span className="font-bold">{o.short}</span>
                <ArrowRight size={12} />
                <span className="font-mono">{tokenFmt(t)} BILL</span>
                {v != null && <span className="text-xs opacity-60">({usd(v, true)})</span>}
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
