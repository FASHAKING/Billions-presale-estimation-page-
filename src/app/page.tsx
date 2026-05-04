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

      {/* Brand-coloured ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Primary blue radial */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[480px] rounded-full bg-[#0046FF]/18 blur-[130px]" />
        {/* Cyan accent bottom-left */}
        <div className="absolute bottom-1/3 left-1/4 w-[350px] h-[350px] rounded-full bg-[#3EFFC8]/6 blur-[100px]" />
        {/* Light blue right */}
        <div className="absolute top-1/2 right-1/5 w-[280px] h-[280px] rounded-full bg-[#0095FF]/8 blur-[90px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,70,255,0.8) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,70,255,0.8) 1px, transparent 1px)`,
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
