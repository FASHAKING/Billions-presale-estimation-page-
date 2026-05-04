import { NextRequest, NextResponse } from 'next/server'
import { getRounds, getRegistrations, updateRound } from '@/lib/db'

export const runtime = 'nodejs'

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET || 'dev-secret'
  const auth = req.headers.get('x-admin-secret')
  return auth === secret
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const rounds = getRounds()
    const registrations = getRegistrations(500)
    return NextResponse.json({ success: true, data: { rounds, registrations } })
  } catch (err) {
    console.error('[admin rounds GET]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch admin data' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id, ...data } = await req.json()
    if (!id) return NextResponse.json({ success: false, error: 'Round id required' }, { status: 400 })
    updateRound(id, data)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[admin rounds PATCH]', err)
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
  }
}
