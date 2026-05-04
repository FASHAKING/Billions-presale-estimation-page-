'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { Calculator as CalcIcon, TrendingUp, Coins, DollarSign, ChevronDown } from 'lucide-react'
import { formatUSD, formatTokens, formatPercent } from '@/lib/utils'
import type { ApiResponse, EstimateResult, PriceData, PresaleRound, Currency } from '@/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const CURRENCIES: { value: Currency; label: string; icon: string }[] = [
  { value: 'ETH', label: 'Ethereum', icon: 'Ξ' },
  { value: 'BNB', label: 'BNB Chain', icon: '◈' },
  { value: 'USDT', label: 'Tether USDT', icon: '₮' },
  { value: 'USDC', label: 'USD Coin', icon: '$' },
]

interface ReturnRowProps {
  multiplier: string
  value: number
  isHighlight?: boolean
}

function ReturnRow({ multiplier, value, isHighlight }: ReturnRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 px-3 rounded-lg ${
        isHighlight ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-[#0D0D1A]/60'
      }`}
    >
      <span className={`text-sm font-semibold ${isHighlight ? 'text-amber-400' : 'text-gray-400'}`}>
        {multiplier}
      </span>
      <span className={`text-sm font-bold ${isHighlight ? 'text-amber-300' : 'text-white'}`}>
        {formatUSD(value)}
      </span>
    </div>
  )
}

export default function Calculator() {
  const [currency, setCurrency] = useState<Currency>('ETH')
  const [amount, setAmount] = useState('')
  const [roundId, setRoundId] = useState<number | null>(null)
  const [result, setResult] = useState<EstimateResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currencyOpen, setCurrencyOpen] = useState(false)

  const { data: roundsData } = useSWR<ApiResponse<PresaleRound[]>>('/api/presale', fetcher)
  const { data: priceData } = useSWR<ApiResponse<PriceData>>('/api/price', fetcher, {
    refreshInterval: 30_000,
  })

  const rounds = roundsData?.data?.filter(r => r.status !== 'closed') ?? []
  const activeRound = rounds.find(r => r.status === 'active')
  const selectedRoundId = roundId ?? activeRound?.id ?? rounds[0]?.id ?? null

  const prices = priceData?.data
  const currencyRate: Record<Currency, number> = {
    ETH: prices?.eth ?? 3500,
    BNB: prices?.bnb ?? 580,
    USDT: prices?.usdt ?? 1,
    USDC: prices?.usdc ?? 1,
  }

  const usdEquivalent = amount && !isNaN(Number(amount))
    ? Number(amount) * currencyRate[currency]
    : 0

  const calculate = useCallback(async () => {
    if (!amount || !selectedRoundId || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Enter a valid amount')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          round_id: selectedRoundId,
          payment_currency: currency,
          payment_amount: Number(amount),
        }),
      })
      const json = (await res.json()) as ApiResponse<EstimateResult>
      if (!json.success || !json.data) throw new Error(json.error ?? 'Estimation failed')
      setResult(json.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [amount, selectedRoundId, currency])

  const selectedCurrencyInfo = CURRENCIES.find(c => c.value === currency)!

  return (
    <section id="calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Real-Time Estimator
        </p>
        <h2 className="section-title">Calculate Your Allocation</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Enter your investment amount and see exactly how many $BILL tokens you&apos;ll receive,
          plus potential returns at different price targets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Input Panel */}
        <div className="glass-card p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <CalcIcon size={20} className="text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Investment Calculator</h3>
              <p className="text-xs text-gray-500">Real-time $BILL allocation estimator</p>
            </div>
          </div>

          {/* Round selector */}
          <div>
            <label className="label-text">Select Round</label>
            <div className="grid grid-cols-2 gap-2">
              {rounds.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setRoundId(r.id); setResult(null) }}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                    selectedRoundId === r.id
                      ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
                      : 'border-gray-700/50 text-gray-400 hover:border-amber-500/30'
                  }`}
                >
                  <div className="text-xs font-semibold">{r.name}</div>
                  <div className="text-sm font-bold mt-0.5">
                    {formatUSD(r.token_price_usd)}<span className="text-xs font-normal text-gray-500">/BILL</span>
                  </div>
                  {r.status === 'active' && (
                    <div className="text-[10px] text-emerald-400 mt-1">● Active now</div>
                  )}
                  {r.status === 'upcoming' && (
                    <div className="text-[10px] text-blue-400 mt-1">○ Upcoming</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Currency picker */}
          <div>
            <label className="label-text">Payment Currency</label>
            <div className="relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="w-full flex items-center justify-between input-field text-left"
              >
                <span className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold w-5 text-center">
                    {selectedCurrencyInfo.icon}
                  </span>
                  <span className="text-white font-semibold">{currency}</span>
                  <span className="text-gray-500 text-sm">— {selectedCurrencyInfo.label}</span>
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${currencyOpen ? 'rotate-180' : ''}`} />
              </button>
              {currencyOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#12122A] border border-amber-500/20 rounded-xl overflow-hidden z-20 shadow-xl">
                  {CURRENCIES.map(c => (
                    <button
                      key={c.value}
                      onClick={() => { setCurrency(c.value); setCurrencyOpen(false); setResult(null) }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-amber-500/5 transition-colors ${
                        currency === c.value ? 'text-amber-400' : 'text-gray-300'
                      }`}
                    >
                      <span className="text-amber-400/80 font-bold w-5 text-center">{c.icon}</span>
                      <div>
                        <div className="text-sm font-semibold">{c.value}</div>
                        <div className="text-xs text-gray-500">{c.label}</div>
                      </div>
                      <span className="ml-auto text-xs text-gray-600">
                        ${currencyRate[c.value].toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="label-text">Investment Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={e => { setAmount(e.target.value); setResult(null) }}
                placeholder={`e.g. 1.5`}
                className="input-field pr-20"
                min="0"
                step="any"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-400">
                {currency}
              </span>
            </div>
            {usdEquivalent > 0 && (
              <p className="text-xs text-gray-500 mt-1.5 ml-1">
                ≈ {formatUSD(usdEquivalent)} USD
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={calculate}
            disabled={loading || !amount || !selectedRoundId}
            className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Calculating…
              </>
            ) : (
              <>
                <CalcIcon size={18} />
                Calculate My Allocation
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="flex flex-col gap-4">
          {result ? (
            <>
              {/* Token allocation */}
              <div className="glass-card p-6 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.06)]">
                <div className="flex items-center gap-2 mb-4">
                  <Coins size={18} className="text-amber-400" />
                  <h3 className="font-bold text-white">Your Allocation</h3>
                  <span className="ml-auto tag-active">{result.round_name}</span>
                </div>

                <div className="text-5xl font-black gradient-text mb-2">
                  {formatTokens(result.token_amount)}
                </div>
                <div className="text-xl text-gray-400 font-semibold mb-4">$BILL tokens</div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-[#0D0D1A]/60 rounded-lg p-3">
                    <div className="text-gray-500 text-xs mb-1">USD Invested</div>
                    <div className="font-bold text-white">{formatUSD(result.usd_invested)}</div>
                  </div>
                  <div className="bg-[#0D0D1A]/60 rounded-lg p-3">
                    <div className="text-gray-500 text-xs mb-1">Token Price</div>
                    <div className="font-bold text-white">{formatUSD(result.token_price_usd)}</div>
                  </div>
                  <div className="bg-[#0D0D1A]/60 rounded-lg p-3">
                    <div className="text-gray-500 text-xs mb-1">% of Supply</div>
                    <div className="font-bold text-amber-400">{formatPercent(result.percentage_of_supply, 6)}</div>
                  </div>
                  <div className="bg-[#0D0D1A]/60 rounded-lg p-3">
                    <div className="text-gray-500 text-xs mb-1">Tokens Left</div>
                    <div className="font-bold text-white">{formatTokens(result.tokens_remaining)}</div>
                  </div>
                </div>
              </div>

              {/* Potential returns */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-emerald-400" />
                  <h3 className="font-bold text-white">Potential Returns</h3>
                  <span className="ml-auto text-xs text-gray-600">at listing price</span>
                </div>
                <div className="flex flex-col gap-2">
                  <ReturnRow multiplier="2x ($0.0008)" value={result.potential_returns.at_2x} />
                  <ReturnRow multiplier="5x ($0.002)" value={result.potential_returns.at_5x} />
                  <ReturnRow multiplier="10x ($0.004)" value={result.potential_returns.at_10x} isHighlight />
                  <ReturnRow multiplier="50x ($0.02)" value={result.potential_returns.at_50x} />
                  <ReturnRow multiplier="100x ($0.04)" value={result.potential_returns.at_100x} />
                </div>
                <p className="text-[10px] text-gray-600 mt-3">
                  * Projections are illustrative only and not financial advice.
                </p>
              </div>

              {/* Cross-currency cost */}
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign size={16} className="text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Cost in Other Currencies</h3>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">ETH</div>
                    <div className="font-bold text-white">Ξ {result.price_in_currencies.eth.toFixed(4)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">BNB</div>
                    <div className="font-bold text-white">◈ {result.price_in_currencies.bnb.toFixed(4)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">USDT</div>
                    <div className="font-bold text-white">₮ {result.price_in_currencies.usdt.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <a href="#register" className="btn-primary text-center text-base py-4">
                Register My Spot →
              </a>
            </>
          ) : (
            /* Placeholder */
            <div className="glass-card p-10 flex flex-col items-center justify-center gap-4 min-h-[400px] border-dashed">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <CalcIcon size={32} className="text-amber-400/50" />
              </div>
              <p className="text-gray-500 text-center text-sm max-w-48">
                Enter an investment amount to see your estimated $BILL allocation
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
