import { NextResponse } from 'next/server'
import { CONTRACT_ADDRESS } from '@/lib/constants'
import type { BillPrice } from '@/types'

export const runtime = 'nodejs'

const DEXSCREENER = `https://api.dexscreener.com/latest/dex/tokens/${CONTRACT_ADDRESS}`
const TTL_MS = 30_000

// Module-level in-memory cache (survives hot reloads in dev via singleton pattern)
declare global {
  // eslint-disable-next-line no-var
  var __billPriceCache: { data: BillPrice; ts: number } | null
}
globalThis.__billPriceCache ??= null

export async function GET() {
  const now = Date.now()
  if (globalThis.__billPriceCache && now - globalThis.__billPriceCache.ts < TTL_MS) {
    return NextResponse.json({ success: true, data: globalThis.__billPriceCache.data })
  }

  try {
    const res = await fetch(DEXSCREENER, {
      headers: { Accept: 'application/json' },
      // no Next cache — we manage it ourselves
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`DexScreener responded ${res.status}`)

    const json = await res.json() as {
      pairs?: Array<{
        chainId: string
        dexId: string
        pairAddress: string
        priceUsd?: string
        priceChange?: { h24?: number }
        fdv?: number
        liquidity?: { usd?: number }
      }>
    }

    const pairs = json.pairs ?? []
    if (pairs.length === 0) throw new Error('No pairs found for this token')

    // Use the pair with the highest liquidity for accurate pricing
    const best = pairs
      .filter(p => p.priceUsd && parseFloat(p.priceUsd) > 0)
      .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0]

    if (!best) throw new Error('No valid pair with a USD price found')

    const data: BillPrice = {
      price: parseFloat(best.priceUsd!),
      priceChange24h: best.priceChange?.h24 ?? 0,
      fdv: best.fdv ?? null,
      liquidity: best.liquidity?.usd ?? null,
      pairAddress: best.pairAddress,
      dexId: best.dexId,
      chainId: best.chainId,
      updatedAt: now,
    }

    globalThis.__billPriceCache = { data, ts: now }
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('[price/bill]', err)
    if (globalThis.__billPriceCache) {
      return NextResponse.json({ success: true, data: globalThis.__billPriceCache.data, stale: true })
    }
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Price unavailable' },
      { status: 503 }
    )
  }
}
