'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import BillionsLogo from './BillionsLogo'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'Calculator', href: '#calculator' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(0,70,255,0.12)] backdrop-blur-xl bg-[#070A18]/85">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <BillionsLogo size={34} />
            <span className="text-xl font-black tracking-tight text-white">
              Billions
            </span>
            <span className="hidden sm:inline text-xs text-gray-600 font-medium ml-1">
              Presale Estimator
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-gray-400 hover:text-white transition-colors font-medium"
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

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400 hover:text-white transition-colors">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[rgba(0,70,255,0.12)] bg-[#070A18]/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block text-sm text-gray-400 hover:text-white py-2 font-medium transition-colors"
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
