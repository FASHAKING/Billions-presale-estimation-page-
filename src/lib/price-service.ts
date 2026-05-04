import { getCachedPrices, upsertPrice } from './db'
import type { PriceData } from '@/types'

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin,bitcoin,tether,usd-coin&vs_currencies=usd'

const CACHE_TTL_MS = (Number(process.env.PRICE_CACHE_TTL) || 60) * 1000

export async function getPrices(): Promise<PriceData> {
  const cache = getCachedPrices()

  // Check if cache is still fresh
  const ethEntry = cache['eth']
  if (ethEntry) {
    const age = Date.now() - new Date(ethEntry.updated_at + 'Z').getTime()
    if (age < CACHE_TTL_MS) {
      return buildPriceData(cache)
    }
  }

  // Attempt to refresh from CoinGecko
  try {
    const res = await fetch(COINGECKO_URL, {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    })

    if (!res.ok) throw new Error(`CoinGecko ${res.status}`)

    const json = await res.json() as {
      ethereum: { usd: number }
      binancecoin: { usd: number }
      bitcoin: { usd: number }
      tether: { usd: number }
      'usd-coin': { usd: number }
    }

    const prices = {
      eth: json.ethereum.usd,
      bnb: json.binancecoin.usd,
      btc: json.bitcoin.usd,
      usdt: json.tether.usd,
      usdc: json['usd-coin'].usd,
    }

    for (const [symbol, price] of Object.entries(prices)) {
      upsertPrice(symbol, price)
    }

    const updated = new Date().toISOString()
    return {
      eth: prices.eth,
      bnb: prices.bnb,
      btc: prices.btc,
      usdt: prices.usdt,
      usdc: prices.usdc,
      updated_at: updated,
    }
  } catch {
    // Return stale cache on failure
    return buildPriceData(cache)
  }
}

function buildPriceData(cache: Record<string, { price_usd: number; updated_at: string }>): PriceData {
  return {
    eth: cache['eth']?.price_usd ?? 3500,
    bnb: cache['bnb']?.price_usd ?? 580,
    btc: cache['btc']?.price_usd ?? 65000,
    usdt: cache['usdt']?.price_usd ?? 1,
    usdc: cache['usdc']?.price_usd ?? 1,
    updated_at: cache['eth']?.updated_at ?? new Date().toISOString(),
  }
}
