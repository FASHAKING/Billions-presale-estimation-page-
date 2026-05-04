export interface BillPrice {
  price: number          // USD
  priceChange24h: number // percent
  fdv: number | null
  liquidity: number | null
  pairAddress: string
  dexId: string
  chainId: string
  updatedAt: number      // epoch ms
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  stale?: boolean
  error?: string
}
