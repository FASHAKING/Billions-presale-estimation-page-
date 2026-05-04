'use client'

import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'Calculator', href: '#calculator' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-amber-500/10 backdrop-blur-xl bg-[#0D0D1A]/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <Zap className="w-4 h-4 text-black" fill="black" />
            </div>
            <span className="text-xl font-black tracking-tight gradient-text">Billions</span>
            <span className="hidden sm:inline text-xs text-gray-600 font-medium ml-1">Presale Estimator</span>
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-gray-400 hover:text-amber-400 transition-colors font-medium"
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://kaito.ai/capital-launchpad"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2 px-5 rounded-lg"
            >
              Submit Selection ↗
            </a>
          </div>

          {/* Mobile */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-amber-500/10 bg-[#0D0D1A]/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block text-sm text-gray-400 hover:text-amber-400 py-2 font-medium"
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://kaito.ai/capital-launchpad"
              target="_blank"
              rel="noopener noreferrer"
              className="block btn-primary text-sm text-center mt-4"
            >
              Submit Selection ↗
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
