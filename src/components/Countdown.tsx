'use client'

import { useEffect, useState } from 'react'

interface CountdownProps {
  targetDate: string | null
  label?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

function Pad({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#0D0D1A] border border-amber-500/20 rounded-lg px-3 py-2 min-w-[52px] text-center">
        <span className="text-xl font-mono font-bold text-amber-400">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{unit}</span>
    </div>
  )
}

export default function Countdown({ targetDate, label = 'Round ends in' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    if (!targetDate) return
    setTimeLeft(calcTimeLeft(targetDate))
    const id = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1_000)
    return () => clearInterval(id)
  }, [targetDate])

  if (!targetDate || !timeLeft) return null

  const isExpired = Object.values(timeLeft).every(v => v === 0)

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</span>
      {isExpired ? (
        <span className="text-amber-400 font-bold">Round Ended</span>
      ) : (
        <div className="flex items-end gap-2">
          <Pad value={timeLeft.days} unit="Days" />
          <span className="text-amber-500/50 font-bold pb-5">:</span>
          <Pad value={timeLeft.hours} unit="Hours" />
          <span className="text-amber-500/50 font-bold pb-5">:</span>
          <Pad value={timeLeft.minutes} unit="Mins" />
          <span className="text-amber-500/50 font-bold pb-5">:</span>
          <Pad value={timeLeft.seconds} unit="Secs" />
        </div>
      )}
    </div>
  )
}
