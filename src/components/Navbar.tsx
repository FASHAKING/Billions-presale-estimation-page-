'use client'

import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Presale Rounds', href: '#rounds' },
    { label: 'Calculator', href: '#calculator' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-amber-500/10 backdrop-blur-xl bg-[#0D0D1A]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <Zap className="w-4 h-4 text-black" fill="black" />
            </div>
            <span className="text-xl font-black tracking-tight">
              <span className="gradient-text">Billions</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-gray-400 hover:text-amber-400 transition-colors duration-200 font-medium"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/admin" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Admin
            </a>
            <a href="#register" className="btn-primary text-sm py-2 px-5 rounded-lg">
              Register Interest
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-amber-500/10 bg-[#0D0D1A]/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block text-sm text-gray-400 hover:text-amber-400 py-2 transition-colors font-medium"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#register"
              onClick={() => setOpen(false)}
              className="block btn-primary text-sm text-center mt-4"
            >
              Register Interest
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
