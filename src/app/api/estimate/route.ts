import { NextRequest, NextResponse } from 'next/server'
import { getRoundById } from '@/lib/db'
import { getPrices } from '@/lib/price-service'
import { TOTAL_SUPPLY } from '@/lib/utils'
import type { EstimateRequest, EstimateResult } from '@/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EstimateRequest
    const { round_id, payment_currency, payment_amount } = body

    if (!round_id || !payment_currency || !payment_amount || payment_amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid request parameters' }, { status: 400 })
    }

    const round = getRoundById(round_id)
    if (!round) {
      return NextResponse.json({ success: false, error: 'Round not found' }, { status: 404 })
    }

    if (round.status === 'closed') {
      return NextResponse.json({ success: false, error: 'This round is closed' }, { status: 400 })
    }

    const prices = await getPrices()

    // Resolve to USD
    const currencyPrices: Record<string, number> = {
      ETH: prices.eth,
      BNB: prices.bnb,
      USDT: prices.usdt,
      USDC: prices.usdc,
      BTC: prices.btc,
    }

    const usdRate = currencyPrices[payment_currency.toUpperCase()]
    if (!usdRate) {
      return NextResponse.json({ success: false, error: 'Unsupported currency' }, { status: 400 })
    }

    const usd_invested = payment_amount * usdRate
    const token_amount = usd_invested / round.token_price_usd
    const tokens_remaining = Math.max(round.total_tokens - round.tokens_sold, 0)
    const percentage_of_supply = (token_amount / TOTAL_SUPPLY) * 100

    const result: EstimateResult = {
      token_amount,
      usd_invested,
      token_price_usd: round.token_price_usd,
      round_name: round.name,
      tokens_remaining,
      percentage_of_supply,
      potential_returns: {
        at_2x: token_amount * round.token_price_usd * 2,
        at_5x: token_amount * round.token_price_usd * 5,
        at_10x: token_amount * round.token_price_usd * 10,
        at_50x: token_amount * round.token_price_usd * 50,
        at_100x: token_amount * round.token_price_usd * 100,
      },
      price_in_currencies: {
        eth: usd_invested / prices.eth,
        bnb: usd_invested / prices.bnb,
        usdt: usd_invested,
      },
    }

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    console.error('[estimate POST]', err)
    return NextResponse.json({ success: false, error: 'Estimation failed' }, { status: 500 })
  }
}
