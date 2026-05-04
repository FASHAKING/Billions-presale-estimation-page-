'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BarChart3, Users, DollarSign, Coins, RefreshCw,
  Lock, CheckCircle, Clock, TrendingUp,
} from 'lucide-react'
import { formatUSD, formatTokens, progressPercent } from '@/lib/utils'
import type { PresaleRound, Registration } from '@/types'

interface AdminData {
  rounds: PresaleRound[]
  registrations: Registration[]
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  upcoming: 'Upcoming',
  closed: 'Closed',
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  active: <Clock size={14} className="text-emerald-400" />,
  upcoming: <TrendingUp size={14} className="text-blue-400" />,
  closed: <CheckCircle size={14} className="text-gray-500" />,
}

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'rounds' | 'registrations'>('rounds')
  const [updating, setUpdating] = useState<number | null>(null)

  const load = useCallback(async (s: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/rounds', {
        headers: { 'x-admin-secret': s },
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? 'Unauthorized')
      setData(json.data)
      setAuthed(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
      setAuthed(false)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    load(secret)
  }

  const updateRoundStatus = async (id: number, status: string) => {
    setUpdating(id)
    try {
      await fetch('/api/admin/rounds', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({ id, status }),
      })
      await load(secret)
    } finally {
      setUpdating(null)
    }
  }

  useEffect(() => {
    const devSecret = process.env.NODE_ENV === 'development' ? 'dev-secret' : ''
    if (devSecret) { setSecret(devSecret); load(devSecret) }
  }, [load])

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D1A] px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 flex items-center justify-center mx-auto mb-4">
              <Lock size={26} className="text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Billions Presale</p>
          </div>
          <form onSubmit={handleLogin} className="glass-card p-6 flex flex-col gap-4">
            <div>
              <label className="label-text">Admin Secret</label>
              <input
                type="password"
                value={secret}
                onChange={e => setSecret(e.target.value)}
                placeholder="Enter admin secret"
                className="input-field"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary py-3">
              {loading ? 'Authenticating…' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const rounds = data?.rounds ?? []
  const regs = data?.registrations ?? []
  const totalRaised = regs.reduce((s, r) => s + r.usd_value, 0)
  const totalTokens = rounds.reduce((s, r) => s + r.tokens_sold, 0)

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white">
      {/* Header */}
      <div className="border-b border-amber-500/10 bg-[#12122A]/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 size={20} className="text-amber-400" />
            <h1 className="text-lg font-bold">Billions Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => load(secret)}
              className="text-gray-500 hover:text-amber-400 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <a href="/" className="btn-secondary text-sm py-2 px-4">← Public Site</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: DollarSign, label: 'Total Raised', value: formatUSD(totalRaised), color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { icon: Users, label: 'Registrations', value: regs.length.toString(), color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: Coins, label: 'Tokens Allocated', value: formatTokens(totalTokens), color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { icon: BarChart3, label: 'Total Rounds', value: rounds.length.toString(), color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map(s => (
            <div key={s.label} className="glass-card p-5">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon size={18} className={s.color} />
              </div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#12122A] p-1 rounded-xl w-fit">
          {(['rounds', 'registrations'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-amber-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'rounds' ? `Rounds (${rounds.length})` : `Registrations (${regs.length})`}
            </button>
          ))}
        </div>

        {/* Rounds table */}
        {activeTab === 'rounds' && (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-500/10">
                  {['Round', 'Price', 'Tokens Sold', 'Progress', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rounds.map(r => {
                  const pct = progressPercent(r.tokens_sold, r.total_tokens)
                  return (
                    <tr key={r.id} className="border-b border-gray-800/50 hover:bg-amber-500/3 transition-colors">
                      <td className="px-4 py-4 font-semibold text-white">{r.name}</td>
                      <td className="px-4 py-4 text-amber-400 font-mono">{formatUSD(r.token_price_usd)}</td>
                      <td className="px-4 py-4 text-gray-300">{formatTokens(r.tokens_sold)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-gray-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-amber-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{pct.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          {STATUS_ICON[r.status]}
                          <span className="text-xs">{STATUS_LABELS[r.status]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {r.status !== 'active' && (
                            <button
                              onClick={() => updateRoundStatus(r.id, 'active')}
                              disabled={updating === r.id}
                              className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg hover:bg-emerald-500/25 transition-colors disabled:opacity-50"
                            >
                              Set Active
                            </button>
                          )}
                          {r.status !== 'closed' && (
                            <button
                              onClick={() => updateRoundStatus(r.id, 'closed')}
                              disabled={updating === r.id}
                              className="text-xs bg-gray-500/15 text-gray-400 border border-gray-500/30 px-2.5 py-1 rounded-lg hover:bg-gray-500/25 transition-colors disabled:opacity-50"
                            >
                              Close
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Registrations table */}
        {activeTab === 'registrations' && (
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-amber-500/10">
                  {['#', 'Email', 'Round', 'Currency', 'Amount', 'USD Value', 'Tokens', 'Date'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-gray-600">
                      No registrations yet
                    </td>
                  </tr>
                ) : (
                  regs.map(r => (
                    <tr key={r.id} className="border-b border-gray-800/30 hover:bg-amber-500/3 transition-colors">
                      <td className="px-4 py-3 text-gray-600 text-xs">#{r.id}</td>
                      <td className="px-4 py-3 text-white font-medium">{r.email}</td>
                      <td className="px-4 py-3 text-gray-400">
                        {rounds.find(rd => rd.id === r.round_id)?.name ?? `Round ${r.round_id}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-amber-500/10 text-amber-400 text-xs px-2 py-0.5 rounded font-mono">
                          {r.payment_currency}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 font-mono">{r.payment_amount}</td>
                      <td className="px-4 py-3 text-emerald-400 font-semibold">{formatUSD(r.usd_value)}</td>
                      <td className="px-4 py-3 text-white">{formatTokens(r.token_amount)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
