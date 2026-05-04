'use client'

import useSWR from 'swr'
import { TrendingUp, TrendingDown, RefreshCw, ExternalLink } from 'lucide-react'
import { CONTRACT_ADDRESS } from '@/lib/constants'
import type { ApiResponse, BillPrice } from '@/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

function fmt(n: number): string {
  if (n >= 1) return n.toLocaleString('en-US', { maximumFractionDigits: 4 })
  if (n < 0.0001) return n.toFixed(8)
  return n.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })
}

function fmtCompact(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}

export default function PriceBanner() {
  const { data, isLoading, mutate, isValidating } = useSWR<ApiResponse<BillPrice>>(
    '/api/price',
    fetcher,
    { refreshInterval: 30_000, revalidateOnFocus: true }
  )

  const p = data?.data
  const up = (p?.priceChange24h ?? 0) >= 0

  const dexUrl = p
    ? `https://dexscreener.com/${p.chainId}/${p.pairAddress}`
    : `https://dexscreener.com/bsc/${CONTRACT_ADDRESS}`

  return (
    <div className="sticky top-16 z-40 border-b border-[rgba(0,70,255,0.12)] bg-[#070A18]/92 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">

          {/* Token identity */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#0046FF] flex items-center justify-center text-[9px] font-black text-white shadow-[0_0_8px_rgba(0,70,255,0.5)]">
              B
            </div>
            <span className="text-sm font-bold text-white">$BILL</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3EFFC8] glow-dot ml-1" />
            <span className="text-[10px] text-[#3EFFC8] font-semibold">LIVE</span>
          </div>

          {/* Price */}
          {isLoading ? (
            <div className="h-5 w-28 rounded bg-[#0C1029] animate-pulse" />
          ) : p ? (
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-white tracking-tight">
                ${fmt(p.price)}
              </span>
              <span className={`flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-lg ${
                up
                  ? 'bg-[rgba(62,255,200,0.1)] text-[#3EFFC8]'
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {up ? '+' : ''}{p.priceChange24h.toFixed(2)}%
              </span>
              <span className="hidden sm:block text-[10px] text-gray-600">24h</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">Price unavailable</span>
          )}

          {/* FDV */}
          {p?.fdv != null && (
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">FDV</span>
              <span className="text-xs font-semibold text-gray-300">{fmtCompact(p.fdv)}</span>
            </div>
          )}

          {/* Liquidity */}
          {p?.liquidity != null && (
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">Liquidity</span>
              <span className="text-xs font-semibold text-gray-300">{fmtCompact(p.liquidity)}</span>
            </div>
          )}

          {/* Presale price */}
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] text-gray-600 uppercase tracking-wider">Presale</span>
            <span className="text-xs font-semibold text-gray-400">$0.0100</span>
          </div>

          {/* vs presale multiplier */}
          {p && (
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">vs presale</span>
              <span className={`text-xs font-bold ${p.price >= 0.01 ? 'text-[#3EFFC8]' : 'text-red-400'}`}>
                {(p.price / 0.01).toFixed(2)}x
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="ml-auto flex items-center gap-3">
            {data?.stale && (
              <span className="text-[10px] text-[#0095FF]/60">stale</span>
            )}
            <button
              onClick={() => mutate()}
              title="Refresh price"
              className="text-gray-600 hover:text-[#0046FF] transition-colors"
            >
              <RefreshCw size={13} className={isValidating ? 'animate-spin' : ''} />
            </button>
            <a
              href={dexUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-[11px] text-gray-600 hover:text-[#0095FF] transition-colors"
            >
              Chart <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
