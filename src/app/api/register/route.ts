import { NextRequest, NextResponse } from 'next/server'
import { createRegistration, getRoundById } from '@/lib/db'
import type { RegisterRequest } from '@/types'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterRequest

    if (!body.email || !EMAIL_RE.test(body.email)) {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 })
    }
    if (!body.round_id || !body.payment_currency || !body.payment_amount || !body.token_amount) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const round = getRoundById(body.round_id)
    if (!round || round.status === 'closed') {
      return NextResponse.json({ success: false, error: 'Round unavailable' }, { status: 400 })
    }

    // Validate against round limits
    if (body.usd_value < round.min_investment_usd) {
      return NextResponse.json(
        { success: false, error: `Minimum investment is $${round.min_investment_usd}` },
        { status: 400 }
      )
    }
    if (body.usd_value > round.max_investment_usd) {
      return NextResponse.json(
        { success: false, error: `Maximum investment is $${round.max_investment_usd}` },
        { status: 400 }
      )
    }

    const registration = createRegistration({
      email: body.email.toLowerCase().trim(),
      wallet_address: body.wallet_address?.trim() || null,
      round_id: body.round_id,
      payment_currency: body.payment_currency,
      payment_amount: body.payment_amount,
      token_amount: body.token_amount,
      usd_value: body.usd_value,
    })

    return NextResponse.json({ success: true, data: { id: registration.id } }, { status: 201 })
  } catch (err) {
    console.error('[register POST]', err)
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 })
  }
}
