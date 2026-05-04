import Navbar from '@/components/Navbar'
import PriceBanner from '@/components/PriceBanner'
import PresaleCalculator from '@/components/PresaleCalculator'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative overflow-x-hidden min-h-screen">
      <Navbar />
      <PriceBanner />

      {/* Subtle background radial */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(245,158,11,0.6) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(245,158,11,0.6) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <PresaleCalculator />
      <FAQSection />
      <Footer />
    </main>
  )
}
