import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import PriceTicker from '@/components/PriceTicker'
import StatsSection from '@/components/StatsSection'
import PresaleRounds from '@/components/PresaleRounds'
import Calculator from '@/components/Calculator'
import RegistrationForm from '@/components/RegistrationForm'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <PriceTicker />
      <StatsSection />

      {/* How it works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Simple Process
          </p>
          <h2 className="section-title">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              step: '01',
              title: 'Choose a Round',
              desc: 'Select the presale round that fits your investment timeline. Earlier rounds = lower price.',
              icon: '🎯',
            },
            {
              step: '02',
              title: 'Calculate Allocation',
              desc: 'Enter your investment in ETH, BNB, USDT or USDC. See your exact $BILL allocation instantly.',
              icon: '🧮',
            },
            {
              step: '03',
              title: 'Register & Invest',
              desc: 'Lock your spot with your email. We send official payment instructions to complete your purchase.',
              icon: '🚀',
            },
          ].map(item => (
            <div key={item.step} className="glass-card-hover p-6 text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-xs font-black text-amber-500/50 mb-2 tracking-widest">{item.step}</div>
              <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <PresaleRounds />
      <Calculator />
      <RegistrationForm />
      <FAQSection />
      <Footer />
    </main>
  )
}
