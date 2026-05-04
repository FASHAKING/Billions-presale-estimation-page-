'use client'

import useSWR from 'swr'
import { CheckCircle, Clock, Lock } from 'lucide-react'
import { formatUSD, formatTokens, progressPercent } from '@/lib/utils'
import Countdown from './Countdown'
import type { ApiResponse, PresaleRound } from '@/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    icon: Clock,
    tagClass: 'tag-active',
    iconColor: 'text-emerald-400',
  },
  upcoming: {
    label: 'Upcoming',
    icon: Clock,
    tagClass: 'tag-upcoming',
    iconColor: 'text-blue-400',
  },
  closed: {
    label: 'Closed',
    icon: CheckCircle,
    tagClass: 'tag-closed',
    iconColor: 'text-gray-500',
  },
}

function RoundCard({ round }: { round: PresaleRound }) {
  const cfg = STATUS_CONFIG[round.status]
  const pct = progressPercent(round.tokens_sold, round.total_tokens)
  const remaining = Math.max(round.total_tokens - round.tokens_sold, 0)

  return (
    <div
      className={`glass-card p-6 flex flex-col gap-4 transition-all duration-300 ${
        round.status === 'active'
          ? 'border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.08)]'
          : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{round.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatUSD(round.min_investment_usd)} – {formatUSD(round.max_investment_usd)}
          </p>
        </div>
        <span className={cfg.tagClass}>{cfg.label}</span>
      </div>

      {/* Price highlight */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black gradient-text">
          {formatUSD(round.token_price_usd)}
        </span>
        <span className="text-sm text-gray-500">per $BILL</span>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>{formatTokens(round.tokens_sold)} sold</span>
          <span>{pct.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#0D0D1A] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              round.status === 'active'
                ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                : round.status === 'closed'
                ? 'bg-gray-600'
                : 'bg-blue-600'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1.5">
          <span>{formatTokens(remaining)} remaining</span>
          <span>of {formatTokens(round.total_tokens)}</span>
        </div>
      </div>

      {/* Countdown or CTA */}
      {round.status === 'active' && round.end_date && (
        <div className="pt-2 border-t border-amber-500/10">
          <Countdown targetDate={round.end_date} label="Ends in" />
        </div>
      )}

      {round.status === 'upcoming' && round.start_date && (
        <div className="pt-2 border-t border-blue-500/10">
          <Countdown targetDate={round.start_date} label="Starts in" />
        </div>
      )}

      {round.status === 'closed' && (
        <div className="flex items-center gap-2 text-gray-500 text-sm pt-2 border-t border-gray-700/30">
          <Lock size={14} />
          <span>Round sold out</span>
        </div>
      )}

      {/* CTA */}
      {round.status !== 'closed' && (
        <a
          href="#calculator"
          className={`text-center text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 ${
            round.status === 'active'
              ? 'btn-primary'
              : 'btn-secondary'
          }`}
        >
          {round.status === 'active' ? 'Calculate My Allocation' : 'Get Notified'}
        </a>
      )}
    </div>
  )
}

export default function PresaleRounds() {
  const { data, isLoading } = useSWR<ApiResponse<PresaleRound[]>>('/api/presale', fetcher, {
    refreshInterval: 60_000,
  })

  return (
    <section id="rounds" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Token Distribution
        </p>
        <h2 className="section-title">Presale Rounds</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Earlier rounds offer lower prices. Don&apos;t miss your window — token price increases with each round.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card p-6 h-64 animate-pulse">
              <div className="h-5 bg-gray-800 rounded mb-4 w-3/4" />
              <div className="h-8 bg-gray-800 rounded mb-6 w-1/2" />
              <div className="h-2 bg-gray-800 rounded mb-2" />
              <div className="h-2 bg-gray-800 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {(data?.data ?? []).map(round => (
            <RoundCard key={round.id} round={round} />
          ))}
        </div>
      )}

      {/* Price escalation callout */}
      <div className="mt-8 glass-card p-4 flex items-center gap-3 max-w-2xl mx-auto">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
          <span className="text-amber-400 text-lg">↗</span>
        </div>
        <p className="text-sm text-gray-400">
          Token price escalates from{' '}
          <span className="text-amber-400 font-semibold">$0.0001</span> (Seed) to{' '}
          <span className="text-amber-400 font-semibold">$0.001</span> (Public). Get in early to maximize your allocation.
        </p>
      </div>
    </section>
  )
}
