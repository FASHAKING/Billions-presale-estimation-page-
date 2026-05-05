import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export const metadata: Metadata = {
  title: '$BILL Presale Estimator — Billions Network',
  description:
    'Calculate your $BILL token allocation and real-time value based on your presale investment and option (A, B, or C).',
  keywords: ['BILL token', 'Billions Network', 'presale estimator', 'token allocation', 'crypto presale'],
  openGraph: {
    title: '$BILL Presale Estimator — Billions Network',
    description: 'See exactly how many $BILL tokens you get and what they\'re worth right now.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
