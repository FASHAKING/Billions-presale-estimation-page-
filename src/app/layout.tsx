import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '$BILL Token Presale — Billions',
  description: 'Estimate your $BILL token allocation and real-time value. Join the Billions presale now.',
  keywords: ['BILL token', 'Billions presale', 'crypto presale', 'token sale', 'DeFi'],
  openGraph: {
    title: '$BILL Token Presale — Billions',
    description: 'Calculate your allocation. Get in early.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '$BILL Token Presale',
    description: 'Estimate your $BILL allocation in real-time.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
