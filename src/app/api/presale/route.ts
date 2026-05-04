import { NextResponse } from 'next/server'
import { getRounds } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const rounds = getRounds()
    return NextResponse.json({ success: true, data: rounds })
  } catch (err) {
    console.error('[presale GET]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch rounds' }, { status: 500 })
  }
}
