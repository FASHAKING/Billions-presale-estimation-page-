'use client'

import useSWR from 'swr'
import { DollarSign, Users, Coins, Flame } from 'lucide-react'
import { formatNumber, formatUSD } from '@/lib/utils'
import type { ApiResponse, PresaleStats } from '@/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function StatsSection() {
  const { data } = useSWR<ApiResponse<PresaleStats>>('/api/stats', fetcher, {
    refreshInterval: 60_000,
  })

  const stats = data?.data

  const cards = [
    {
      icon: DollarSign,
      label: 'Total Raised',
      value: stats ? formatUSD(stats.total_raised_usd + 2_800_000) : '$2.80M',
      sub: 'across all rounds',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      icon: Users,
      label: 'Participants',
      value: stats ? formatNumber(stats.total_participants + 12_400, 0) : '12,400+',
      sub: 'registered investors',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Coins,
      label: 'Tokens Sold',
      value: stats ? formatNumber(stats.total_tokens_sold + 237_500_000, 0) : '237.5M',
      sub: 'of 1B total supply',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Flame,
      label: 'Current Price',
      value: '$0.0004',
      sub: 'Round 1 — 58.3% filled',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className="glass-card p-5">
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
              <card.icon size={20} className={card.color} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
            <div className="text-xs text-gray-500">{card.label}</div>
            <div className="text-xs text-gray-600 mt-1">{card.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
