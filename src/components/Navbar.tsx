'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import BillionsLogo from './BillionsLogo'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Calculator', href: '#calculator' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[rgba(0,70,255,0.2)] bg-[#070A18]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'border-b border-[rgba(0,70,255,0.08)] bg-[#070A18]/60 backdrop-blur-md'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className={`transition-all duration-300 ${scrolled ? 'scale-95' : 'scale-100'}`}>
              <BillionsLogo size={34} />
            </div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-[#0095FF] transition-colors duration-200">
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
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium relative group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#0046FF] group-hover:w-full transition-all duration-300" />
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
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden border-t border-[rgba(0,70,255,0.12)] bg-[#070A18]/98 backdrop-blur-xl overflow-hidden transition-all duration-300 ${
          open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
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
    </nav>
  )
}
