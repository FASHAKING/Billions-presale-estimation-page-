import { ExternalLink } from 'lucide-react'
import BillionsLogo from './BillionsLogo'

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(0,70,255,0.1)] mt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <BillionsLogo size={30} />
            <span className="text-lg font-black text-white">Billions</span>
            <span className="text-gray-600 text-sm">Presale Estimator</span>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600">
            <a
              href="https://kaito.ai/capital-launchpad"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#0095FF] transition-colors"
            >
              Submit Selection <ExternalLink size={12} />
            </a>
            <span className="hidden sm:block text-gray-800">·</span>
            <a
              href="https://dexscreener.com/bsc/0xDf24f8c21Cb404B3031a450D8e049D6E39FC1fA5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#0095FF] transition-colors"
            >
              DexScreener <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800/60 mt-8 pt-6 flex flex-col items-center gap-2 text-xs text-gray-700 text-center">
          <span>
            Built with ❤️ for Billions Community by{' '}
            <a
              href="https://x.com/FASHAKING3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0046FF] hover:text-[#0095FF] transition-colors font-semibold"
            >
              fashaking
            </a>
          </span>
          <span>
            This tool is for estimation purposes only and does not constitute financial advice.
            Token prices are volatile. Data sourced from DexScreener.
            © {new Date().getFullYear()} Billions Network.
          </span>
        </div>
      </div>
    </footer>
  )
}
