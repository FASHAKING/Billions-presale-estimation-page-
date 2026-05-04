'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Mail, Wallet, CheckCircle2, AlertCircle } from 'lucide-react'
import { formatUSD, formatTokens } from '@/lib/utils'
import type { ApiResponse, PresaleRound, Currency } from '@/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const CURRENCIES: Currency[] = ['ETH', 'BNB', 'USDT', 'USDC']

export default function RegistrationForm() {
  const { data: roundsData } = useSWR<ApiResponse<PresaleRound[]>>('/api/presale', fetcher)

  const [form, setForm] = useState({
    email: '',
    wallet_address: '',
    round_id: '',
    payment_currency: 'ETH' as Currency,
    payment_amount: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [tokenEstimate, setTokenEstimate] = useState<number | null>(null)

  const rounds = roundsData?.data?.filter(r => r.status !== 'closed') ?? []
  const selectedRound = rounds.find(r => r.id === Number(form.round_id))

  const updateEstimate = (roundId: string, amount: string, currency: Currency) => {
    const round = rounds.find(r => r.id === Number(roundId))
    if (!round || !amount || isNaN(Number(amount))) {
      setTokenEstimate(null)
      return
    }
    // Rough estimate using fallback price
    const USD_RATES: Record<Currency, number> = { ETH: 3500, BNB: 580, USDT: 1, USDC: 1 }
    const usd = Number(amount) * USD_RATES[currency]
    setTokenEstimate(usd / round.token_price_usd)
  }

  const update = (key: keyof typeof form, value: string) => {
    const next = { ...form, [key]: value }
    setForm(next)
    updateEstimate(next.round_id, next.payment_amount, next.payment_currency as Currency)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRound) return

    setStatus('loading')
    setMessage('')

    try {
      const USD_RATES: Record<Currency, number> = { ETH: 3500, BNB: 580, USDT: 1, USDC: 1 }
      const usd = Number(form.payment_amount) * USD_RATES[form.payment_currency]
      const tokens = usd / selectedRound.token_price_usd

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          wallet_address: form.wallet_address || undefined,
          round_id: Number(form.round_id),
          payment_currency: form.payment_currency,
          payment_amount: Number(form.payment_amount),
          token_amount: tokens,
          usd_value: usd,
        }),
      })

      const json = (await res.json()) as ApiResponse<{ id: number }>
      if (!json.success) throw new Error(json.error ?? 'Registration failed')

      setStatus('success')
      setMessage(`You're registered! Reference ID: #${json.data?.id}`)
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <section id="register" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-xl mx-auto glass-card p-10 text-center border-emerald-500/25">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">You&apos;re on the list!</h3>
          <p className="text-gray-400 mb-2">{message}</p>
          <p className="text-sm text-gray-600">
            We&apos;ll email you with next steps and payment instructions before your round opens.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="btn-secondary mt-6 text-sm"
          >
            Register Another
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="register" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Secure Your Spot
        </p>
        <h2 className="section-title">Register Your Interest</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Lock in your allocation now. We&apos;ll send you payment instructions and confirmation details.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8">
          <form onSubmit={submit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="label-text">Email Address *</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Wallet */}
            <div>
              <label className="label-text">Wallet Address <span className="text-gray-600 normal-case font-normal">(optional)</span></label>
              <div className="relative">
                <Wallet size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={form.wallet_address}
                  onChange={e => update('wallet_address', e.target.value)}
                  placeholder="0x... or BSC wallet"
                  className="input-field pl-10 font-mono text-sm"
                />
              </div>
            </div>

            {/* Round */}
            <div>
              <label className="label-text">Presale Round *</label>
              <select
                required
                value={form.round_id}
                onChange={e => update('round_id', e.target.value)}
                className="input-field"
              >
                <option value="">Select a round</option>
                {rounds.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {formatUSD(r.token_price_usd)}/BILL
                    {r.status === 'active' ? ' (Active)' : ' (Upcoming)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency + Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-text">Currency *</label>
                <select
                  required
                  value={form.payment_currency}
                  onChange={e => update('payment_currency', e.target.value as Currency)}
                  className="input-field"
                >
                  {CURRENCIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">Amount *</label>
                <input
                  type="number"
                  required
                  value={form.payment_amount}
                  onChange={e => update('payment_amount', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="any"
                  className="input-field"
                />
              </div>
            </div>

            {/* Token estimate preview */}
            {tokenEstimate !== null && tokenEstimate > 0 && (
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Estimated Allocation</div>
                  <div className="text-2xl font-black gradient-text">
                    {formatTokens(tokenEstimate)} $BILL
                  </div>
                </div>
                <a
                  href="#calculator"
                  className="text-xs text-amber-400 hover:text-amber-300 underline"
                >
                  Calculate exact →
                </a>
              </div>
            )}

            {/* Min/max hint */}
            {selectedRound && (
              <p className="text-xs text-gray-600">
                Min: {formatUSD(selectedRound.min_investment_usd)} · Max: {formatUSD(selectedRound.max_investment_usd)} per participant
              </p>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <AlertCircle size={15} />
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary text-base py-4 mt-2 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Registering…
                </>
              ) : (
                'Register My Allocation'
              )}
            </button>

            <p className="text-xs text-gray-600 text-center">
              By registering you agree to receive email updates. No payment is collected now.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
