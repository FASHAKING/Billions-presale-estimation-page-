'use client'

import useSWR from 'swr'
import { TrendingUp, RefreshCw } from 'lucide-react'
import type { ApiResponse, PriceData } from '@/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const COINS = [
  { key: 'eth' as const, symbol: 'ETH', label: 'Ethereum', color: '#627EEA' },
  { key: 'bnb' as const, symbol: 'BNB', label: 'BNB', color: '#F3BA2F' },
  { key: 'btc' as const, symbol: 'BTC', label: 'Bitcoin', color: '#F7931A' },
  { key: 'usdt' as const, symbol: 'USDT', label: 'Tether', color: '#26A17B' },
]

export default function PriceTicker() {
  const { data, isLoading, mutate } = useSWR<ApiResponse<PriceData>>('/api/price', fetcher, {
    refreshInterval: 30_000,
  })

  const prices = data?.data

  return (
    <div className="border-y border-amber-500/10 bg-[#0D0D1A]/60 backdrop-blur-sm py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 shrink-0 text-amber-400/70">
            <TrendingUp size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Live Prices</span>
          </div>

          <div className="flex items-center gap-6 flex-1">
            {COINS.map(coin => (
              <div key={coin.key} className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold" style={{ color: coin.color }}>
                  {coin.symbol}
                </span>
                {isLoading ? (
                  <div className="w-16 h-3.5 rounded bg-gray-800 animate-pulse" />
                ) : (
                  <span className="text-sm font-semibold text-white">
                    ${prices?.[coin.key]?.toLocaleString('en-US', { maximumFractionDigits: 2 }) ?? '—'}
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => mutate()}
            className="shrink-0 text-gray-600 hover:text-amber-400 transition-colors"
            title="Refresh prices"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
          </button>

          {prices && (
            <span className="shrink-0 text-[10px] text-gray-600">
              Updated {new Date(prices.updated_at + 'Z').toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
