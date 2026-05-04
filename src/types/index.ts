export type RoundStatus = 'upcoming' | 'active' | 'closed'
export type Currency = 'ETH' | 'BNB' | 'USDT' | 'USDC'

export interface PresaleRound {
  id: number
  name: string
  token_price_usd: number
  total_tokens: number
  tokens_sold: number
  min_investment_usd: number
  max_investment_usd: number
  status: RoundStatus
  start_date: string | null
  end_date: string | null
  created_at: string
}

export interface Registration {
  id: number
  email: string
  wallet_address: string | null
  round_id: number
  payment_currency: Currency
  payment_amount: number
  token_amount: number
  usd_value: number
  created_at: string
}

export interface PriceData {
  eth: number
  bnb: number
  btc: number
  usdt: number
  usdc: number
  updated_at: string
}

export interface EstimateRequest {
  round_id: number
  payment_currency: Currency
  payment_amount: number
}

export interface EstimateResult {
  token_amount: number
  usd_invested: number
  token_price_usd: number
  round_name: string
  tokens_remaining: number
  percentage_of_supply: number
  potential_returns: {
    at_2x: number
    at_5x: number
    at_10x: number
    at_50x: number
    at_100x: number
  }
  price_in_currencies: {
    eth: number
    bnb: number
    usdt: number
  }
}

export interface RegisterRequest {
  email: string
  wallet_address?: string
  round_id: number
  payment_currency: Currency
  payment_amount: number
  token_amount: number
  usd_value: number
}

export interface PresaleStats {
  total_raised_usd: number
  total_participants: number
  total_tokens_sold: number
  active_round: PresaleRound | null
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
