import { NextResponse } from 'next/server'
import { CONTRACT_ADDRESS } from '@/lib/constants'
import type { BillPrice } from '@/types'

export const runtime = 'nodejs'

const DEXSCREENER = `https://api.dexscreener.com/latest/dex/tokens/${CONTRACT_ADDRESS}`

export async function GET() {
  try {
    const res = await fetch(DEXSCREENER, {
      headers: { Accept: 'application/json' },
      // Next.js Data Cache: served from Vercel edge for 30s, then revalidated
      next: { revalidate: 30 },
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
    if (pairs.length === 0) throw new Error('No trading pairs found for this token')

    // Use the pair with the highest liquidity for the most accurate price
    const best = pairs
      .filter(p => p.priceUsd && parseFloat(p.priceUsd) > 0)
      .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0]

    if (!best) throw new Error('No pair found with a valid USD price')

    const data: BillPrice = {
      price: parseFloat(best.priceUsd!),
      priceChange24h: best.priceChange?.h24 ?? 0,
      fdv: best.fdv ?? null,
      liquidity: best.liquidity?.usd ?? null,
      pairAddress: best.pairAddress,
      dexId: best.dexId,
      chainId: best.chainId,
      updatedAt: Date.now(),
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('[price/bill]', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Price unavailable' },
      { status: 503 }
    )
  }
}
