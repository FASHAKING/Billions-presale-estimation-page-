import Navbar from '@/components/Navbar'
import PriceBanner from '@/components/PriceBanner'
import HeroSection from '@/components/HeroSection'
import PresaleCalculator from '@/components/PresaleCalculator'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative overflow-x-hidden min-h-screen">
      <Navbar />
      <PriceBanner />

      {/* ── Animated ambient background ── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Primary blue blob — top centre */}
        <div className="blob-1 absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#0046FF]/14 blur-[140px]" />
        {/* Cyan blob — bottom left */}
        <div className="blob-2 absolute bottom-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[#3EFFC8]/7 blur-[120px]" />
        {/* Light-blue blob — right */}
        <div className="blob-3 absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-[#0095FF]/9 blur-[110px]" />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,70,255,1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,70,255,1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <HeroSection />
      <PresaleCalculator />
      <FAQSection />
      <Footer />
    </main>
  )
}
