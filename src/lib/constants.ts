// $BILL token — Billions Network
export const CONTRACT_ADDRESS = '0xDf24f8c21Cb404B3031a450D8e049D6E39FC1fA5'

// Presale terms: $100M valuation / 10B supply = $0.01 per token
export const PRESALE_PRICE_USD = 0.01
export const TOTAL_SUPPLY = 10_000_000_000

// TGE = May 4, 2026
export const TGE_DATE = new Date('2026-05-04T12:00:00Z')

// Unlock dates derived from TGE
export const OPTION_B_UNLOCK = new Date('2026-11-04T12:00:00Z') // TGE + 6 months
export const OPTION_C_UNLOCK = new Date('2027-05-04T12:00:00Z') // TGE + 12 months

export type PresaleOption = 'A' | 'B' | 'C'

export interface OptionConfig {
  id: PresaleOption
  label: string
  short: string
  description: string
  bonusMultiplier: number    // token multiplier (0 = refund option)
  capitalBonus: number       // cash bonus on top of refund (e.g. 0.05 = 5%)
  lockMonths: number | null  // null = no token lock
  unlockDate: Date | null
}

export const OPTIONS: OptionConfig[] = [
  {
    id: 'A',
    label: 'Full Refund + 5% Bonus',
    short: 'Option A',
    description: 'Receive 100% of your original contribution back plus a 5% cash bonus on top. No $BILL tokens.',
    bonusMultiplier: 0,
    capitalBonus: 0.05,
    lockMonths: null,
    unlockDate: null,
  },
  {
    id: 'B',
    label: '25% Bonus + Full Allocation',
    short: 'Option B',
    description: 'Keep your full allocation + 25% bonus tokens on top. Released 6 months after TGE.',
    bonusMultiplier: 1.25,
    capitalBonus: 0,
    lockMonths: 6,
    unlockDate: OPTION_B_UNLOCK,
  },
  {
    id: 'C',
    label: '50% Bonus + Full Allocation',
    short: 'Option C',
    description: 'Keep your full allocation + 50% bonus tokens on top. Released 12 months after TGE.',
    bonusMultiplier: 1.5,
    capitalBonus: 0,
    lockMonths: 12,
    unlockDate: OPTION_C_UNLOCK,
  },
]

export function calcTokens(investmentUSD: number, option: PresaleOption): number {
  const cfg = OPTIONS.find(o => o.id === option)!
  if (cfg.bonusMultiplier === 0) return 0
  const base = investmentUSD / PRESALE_PRICE_USD
  return base * cfg.bonusMultiplier
}
