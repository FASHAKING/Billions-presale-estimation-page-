import { NextResponse } from 'next/server'
import { getPrices } from '@/lib/price-service'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const prices = await getPrices()
    return NextResponse.json({ success: true, data: prices })
  } catch (err) {
    console.error('[price GET]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch prices' }, { status: 500 })
  }
}
