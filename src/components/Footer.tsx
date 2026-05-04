import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-amber-500/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" fill="black" />
              </div>
              <span className="text-xl font-black gradient-text">Billions</span>
            </a>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Bringing institutional-grade wealth strategies to decentralized finance.
              $BILL token powers the entire ecosystem.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Presale</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#rounds" className="hover:text-amber-400 transition-colors">View Rounds</a></li>
              <li><a href="#calculator" className="hover:text-amber-400 transition-colors">Calculator</a></li>
              <li><a href="#register" className="hover:text-amber-400 transition-colors">Register</a></li>
              <li><a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Whitepaper</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Audit Report</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Billions Protocol. All rights reserved.</span>
          <span className="text-center">
            ⚠ Not financial advice. Crypto investments carry risk. DYOR.
          </span>
        </div>
      </div>
    </footer>
  )
}
