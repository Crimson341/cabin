import { useState, useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ShoppingBag,
  Coffee,
  Users,
  Instagram,
  Facebook,
  ArrowRight,
  Menu,
  X,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  Calendar,
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

// Hook for scroll-triggered animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Animated section wrapper
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, isInView } = useInView()

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setFormStatus('success')
      setFormState({ name: '', email: '', phone: '', interest: '', message: '' })
    } catch (err) {
      setFormStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  // Track mouse for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#1a1a1a] selection:bg-[#E07B5B] selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="px-6 md:px-12 py-6 border-b border-[#e5e2dc] animate-fade-down">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a
            href="#"
            className="text-sm font-medium tracking-wide hover:text-[#E07B5B] transition-colors duration-300"
          >
            WATER STREET COMMONS.
          </a>

          <div className="hidden md:flex items-center gap-8">
            {['About', 'Spaces', 'Vendors', 'Visit', 'Contact'].map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-[#666] hover:text-[#1a1a1a] transition-all duration-300 hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {item}
              </a>
            ))}
          </div>

          <button
            className="md:hidden text-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 bg-[#F5F3EF] p-8 pt-24 flex flex-col gap-6 md:hidden transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <button className="absolute top-6 right-6" onClick={() => setMobileMenuOpen(false)}>
          <X size={24} />
        </button>
        {['About', 'Spaces', 'Vendors', 'Visit', 'Contact'].map((item, i) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-2xl font-editorial transition-all duration-300"
            style={{
              opacity: mobileMenuOpen ? 1 : 0,
              transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(20px)',
              transitionDelay: `${i * 100}ms`,
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item}
          </a>
        ))}
      </div>

      <main>
        {/* Hero Section - Editorial Magazine Style */}
        <section className="px-6 md:px-12 py-20 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Content - Large Stacked Typography */}
              <div className="lg:col-span-7">
                <p
                  className="text-xs text-[#E07B5B] uppercase tracking-[0.2em] mb-6 animate-fade-up"
                  style={{ animationDuration: '0.8s' }}
                >
                  Downtown Alpena
                </p>
                <h1
                  className="font-editorial leading-[0.95] mb-10 animate-fade-up"
                  style={{ animationDuration: '1s' }}
                >
                  <span className="block text-6xl md:text-8xl lg:text-[120px] italic hover:text-[#E07B5B] transition-colors duration-500 cursor-default">
                    Water
                  </span>
                  <span className="block text-6xl md:text-8xl lg:text-[120px] italic hover:text-[#E07B5B] transition-colors duration-500 cursor-default">
                    Street
                  </span>
                  <span className="block text-6xl md:text-8xl lg:text-[120px] hover:text-[#E07B5B] transition-colors duration-500 cursor-default font-medium not-italic">
                    Commons
                  </span>
                </h1>
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-fade-up"
                  style={{ animationDelay: '400ms', animationDuration: '1s' }}
                >
                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-3 bg-[#1a1a1a] text-white px-8 py-4 text-sm font-medium tracking-wide hover:bg-[#E07B5B] transition-all duration-300"
                  >
                    APPLY FOR 2026
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </a>
                  <a
                    href="#about"
                    className="group inline-flex items-center gap-2 text-sm tracking-wide text-[#666] hover:text-[#1a1a1a] transition-colors border-b border-[#666] pb-1"
                  >
                    Discover More
                  </a>
                </div>
              </div>

              {/* Right Content - Image + Description */}
              <div
                className="lg:col-span-5 animate-fade-left"
                style={{ animationDelay: '300ms', animationDuration: '1s' }}
              >
                <div
                  className="aspect-[3/4] overflow-hidden group mb-8"
                  style={{
                    transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
                    transition: 'transform 0.3s ease-out',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=1200&auto=format&fit=crop"
                    alt="Downtown riverside"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="max-w-sm">
                  <p className="text-[#666] leading-relaxed mb-4">
                    A colorful riverside nook with five tiny shops for local makers to grow, share,
                    and sparkle.
                  </p>
                  <p className="text-xs text-[#999] uppercase tracking-wider">
                    123 Water Street, Alpena MI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section - Magazine Style */}
        <section id="about" className="px-6 md:px-12 py-20 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12">
              <AnimatedSection className="lg:col-span-8">
                <p className="text-xs text-[#E07B5B] uppercase tracking-[0.2em] mb-6">
                  The Story
                </p>
                <h2 className="font-editorial text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-8 italic">
                  Where makers{' '}
                  <span className="text-[#E07B5B] hover:not-italic cursor-default transition-all duration-300">
                    grow
                  </span>
                  ,{' '}
                  <span className="text-[#E07B5B] hover:not-italic cursor-default transition-all duration-300">
                    share
                  </span>
                  , and{' '}
                  <span className="text-[#E07B5B] hover:not-italic cursor-default transition-all duration-300">
                    sparkle
                  </span>
                </h2>
              </AnimatedSection>
              <AnimatedSection className="lg:col-span-4 flex flex-col justify-end" delay={200}>
                <div className="border-l-2 border-[#E07B5B] pl-6">
                  <p className="text-[#666] leading-relaxed mb-6">
                    An initiative by the Downtown Development Authority to activate underutilized
                    riverfront space and provide affordable retail opportunities for emerging
                    entrepreneurs.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wider">
                    {['Local', 'Riverside', 'Community'].map((tag, i) => (
                      <span
                        key={tag}
                        className="px-4 py-2 border border-[#e5e2dc] hover:border-[#E07B5B] hover:text-[#E07B5B] transition-all duration-300 cursor-default"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Spaces Section */}
        <section id="spaces" className="px-6 md:px-12 py-20 md:py-32">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <div className="grid lg:grid-cols-12 gap-8 mb-16">
                <div className="lg:col-span-7">
                  <p className="text-xs text-[#E07B5B] uppercase tracking-[0.2em] mb-6">
                    The Spaces
                  </p>
                  <h2 className="font-editorial text-4xl md:text-6xl lg:text-7xl italic leading-[1.1]">
                    What's at the Commons?
                  </h2>
                </div>
                <div className="lg:col-span-5 flex items-end">
                  <p className="text-[#666] leading-relaxed text-lg">
                    Three distinct experiences designed to bring the community together by the
                    river.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Three Spaces - Editorial Magazine Grid */}
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
              {/* The Shops - Large Featured Card */}
              <AnimatedSection delay={100} className="lg:col-span-7 lg:row-span-2">
                <div className="group h-full bg-white overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-[4/3] lg:aspect-auto lg:h-[400px] relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=1200&auto=format&fit=crop"
                      alt="The Shops"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="font-editorial text-7xl md:text-8xl text-white/20 font-medium">
                        01
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-8">
                      <p className="text-xs text-white/70 uppercase tracking-[0.2em] mb-2">
                        Retail · 5 Spaces
                      </p>
                      <h3 className="font-editorial text-3xl md:text-4xl text-white italic">
                        The Shops
                      </h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-[#666] leading-relaxed text-lg mb-6">
                      Five tiny-but-mighty retail spaces for artisans, bakers, and makers.
                      Perfectly pint-sized for your first storefront.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <ShoppingBag size={16} className="text-[#E07B5B]" />
                      <span className="text-[#E07B5B] font-medium">Now accepting applications</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Anchor Shed */}
              <AnimatedSection delay={200} className="lg:col-span-5">
                <div className="group h-full bg-white overflow-hidden hover:shadow-xl transition-all duration-500">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800&auto=format&fit=crop"
                      alt="Anchor Shed"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="font-editorial text-5xl text-white/20 font-medium">
                        02
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Coffee size={16} className="text-[#E07B5B]" />
                      <p className="text-xs text-[#999] uppercase tracking-[0.15em]">
                        Food & Beverage
                      </p>
                    </div>
                    <h3 className="font-editorial text-2xl italic mb-2 group-hover:text-[#E07B5B] transition-colors">
                      Anchor Shed
                    </h3>
                    <p className="text-[#666] text-sm leading-relaxed">
                      Our central hub for yummy drinks and treats. The heart of our social
                      district experience.
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Cozy Square */}
              <AnimatedSection delay={300} className="lg:col-span-5">
                <div className="group h-full bg-white overflow-hidden hover:shadow-xl transition-all duration-500">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop"
                      alt="Cozy Square"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="font-editorial text-5xl text-white/20 font-medium">
                        03
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Users size={16} className="text-[#E07B5B]" />
                      <p className="text-xs text-[#999] uppercase tracking-[0.15em]">
                        Gathering Space
                      </p>
                    </div>
                    <h3 className="font-editorial text-2xl italic mb-2 group-hover:text-[#E07B5B] transition-colors">
                      Cozy Square
                    </h3>
                    <p className="text-[#666] text-sm leading-relaxed">
                      Fire pits, string lights, and plenty of room to sit and chat. Life
                      happens by the river.
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Social District Banner - Editorial Magazine Style */}
        <section className="px-6 md:px-12 py-24 md:py-40 bg-[#1a1a1a] text-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <AnimatedSection className="lg:col-span-7">
                <p className="text-xs text-[#E07B5B] uppercase tracking-[0.2em] mb-8">
                  Official Social District
                </p>
                <h2 className="font-editorial text-5xl md:text-7xl lg:text-8xl italic leading-[1] mb-8">
                  <span className="block hover:text-[#E07B5B] transition-colors duration-300">
                    Sip,
                  </span>
                  <span className="block hover:text-[#E07B5B] transition-colors duration-300">
                    Shop,
                  </span>
                  <span className="block not-italic font-medium hover:text-[#E07B5B] transition-colors duration-300">
                    & Stroll
                  </span>
                </h2>
                <p className="text-[#999] leading-relaxed mb-10 max-w-md text-lg">
                  Grab a cozy beverage from our anchor shed and enjoy it while you browse the
                  shops or wander the beautiful Thunder Bay River trail.
                </p>
                <a
                  href="#"
                  className="group inline-flex items-center gap-3 border border-white/30 px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-[#1a1a1a] transition-all duration-300"
                >
                  LEARN DISTRICT RULES
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </AnimatedSection>
              <AnimatedSection className="lg:col-span-5" delay={200}>
                <div className="aspect-[3/4] overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop"
                    alt="Social District"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Visit Section - Editorial Magazine Style */}
        <section id="visit" className="px-6 md:px-12 py-20 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              <AnimatedSection>
                <p className="text-xs text-[#E07B5B] uppercase tracking-[0.2em] mb-6">Visit</p>
                <h2 className="font-editorial text-4xl md:text-5xl italic mb-6">
                  Plan Your Visit
                </h2>
                <p className="text-[#666] leading-relaxed text-lg">
                  We're open seasonally from May through October. Come discover our little
                  corner of downtown Alpena.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={100}>
                <div className="bg-white rounded-2xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar
                      size={20}
                      className="text-[#E07B5B] group-hover:scale-110 transition-transform"
                    />
                    <span className="font-medium">Season</span>
                  </div>
                  <p className="text-2xl font-editorial mb-2">May — October</p>
                  <p className="text-[#666] text-sm">2026 Season</p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="bg-white rounded-2xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock
                      size={20}
                      className="text-[#E07B5B] group-hover:rotate-12 transition-transform"
                    />
                    <span className="font-medium">Hours</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      ['Mon – Thu', '10am – 6pm'],
                      ['Fri – Sat', '10am – 8pm'],
                      ['Sunday', '11am – 5pm'],
                    ].map(([day, hours], i) => (
                      <div
                        key={day}
                        className="flex justify-between hover:text-[#E07B5B] transition-colors cursor-default"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      >
                        <span className="text-[#666]">{day}</span>
                        <span>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* CTA Section - Editorial Magazine Style */}
        <section className="px-6 md:px-12 py-24 md:py-40 bg-white overflow-hidden">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-xs text-[#E07B5B] uppercase tracking-[0.2em] mb-8">
                Join Us
              </p>
              <h2 className="font-editorial text-5xl md:text-7xl lg:text-8xl italic leading-[1.05] mb-10">
                Have You Heard About Our Vendor Program?
              </h2>
              <p className="text-[#666] text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                We're looking for passionate makers, bakers, and creators to join our 2026
                season. Affordable rent, built-in foot traffic, and a supportive community.
              </p>
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 bg-[#1a1a1a] text-white px-10 py-5 text-sm font-medium tracking-wide hover:bg-[#E07B5B] transition-all duration-300"
              >
                APPLY NOW
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </AnimatedSection>
        </section>

        {/* Contact Form - Editorial Magazine Style */}
        <section id="contact" className="px-6 md:px-12 py-20 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              <AnimatedSection>
                <p className="text-xs text-[#E07B5B] uppercase tracking-[0.2em] mb-6">Contact</p>
                <h2 className="font-editorial text-4xl md:text-6xl italic mb-8">Get in Touch</h2>
                <p className="text-[#666] leading-relaxed mb-10 max-w-md text-lg">
                  Interested in becoming a vendor? Have questions about the Commons? We'd love
                  to hear from you.
                </p>

                <div className="space-y-6">
                  {[
                    { label: 'Email', value: 'hello@waterstreetcommons.com' },
                    { label: 'Phone', value: '989.356.6422' },
                  ].map((item, i) => (
                    <div
                      key={item.label}
                      className="group cursor-default"
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <p className="text-xs text-[#999] uppercase tracking-wider mb-2">
                        {item.label}
                      </p>
                      <p className="font-medium group-hover:text-[#E07B5B] group-hover:translate-x-2 transition-all duration-300">
                        {item.value}
                      </p>
                    </div>
                  ))}
                  <div className="group cursor-default">
                    <p className="text-xs text-[#999] uppercase tracking-wider mb-2">Address</p>
                    <p className="font-medium group-hover:text-[#E07B5B] transition-colors">
                      123 Water Street
                    </p>
                    <p className="text-[#666]">Alpena, MI 49707</p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-shadow duration-500">
                  {formStatus === 'success' ? (
                    <div className="text-center py-12 animate-fade-up">
                      <div className="w-16 h-16 bg-[#E07B5B]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle className="w-8 h-8 text-[#E07B5B]" />
                      </div>
                      <h3 className="font-editorial text-2xl mb-3">Message Sent!</h3>
                      <p className="text-[#666] mb-6">
                        Thanks for reaching out. We'll get back to you soon.
                      </p>
                      <button
                        onClick={() => setFormStatus('idle')}
                        className="text-[#E07B5B] text-sm font-medium hover:underline"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="group">
                          <label className="text-xs text-[#999] uppercase tracking-wider block mb-2 group-focus-within:text-[#E07B5B] transition-colors">
                            Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formState.name}
                            onChange={(e) =>
                              setFormState({ ...formState, name: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-[#F5F3EF] rounded-lg border-2 border-transparent focus:border-[#E07B5B] focus:outline-none transition-all duration-300 hover:bg-[#f0ede8]"
                            placeholder="Your name"
                          />
                        </div>
                        <div className="group">
                          <label className="text-xs text-[#999] uppercase tracking-wider block mb-2 group-focus-within:text-[#E07B5B] transition-colors">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={formState.email}
                            onChange={(e) =>
                              setFormState({ ...formState, email: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-[#F5F3EF] rounded-lg border-2 border-transparent focus:border-[#E07B5B] focus:outline-none transition-all duration-300 hover:bg-[#f0ede8]"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="group">
                          <label className="text-xs text-[#999] uppercase tracking-wider block mb-2 group-focus-within:text-[#E07B5B] transition-colors">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={formState.phone}
                            onChange={(e) =>
                              setFormState({ ...formState, phone: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-[#F5F3EF] rounded-lg border-2 border-transparent focus:border-[#E07B5B] focus:outline-none transition-all duration-300 hover:bg-[#f0ede8]"
                            placeholder="(989) 555-0123"
                          />
                        </div>
                        <div className="group">
                          <label className="text-xs text-[#999] uppercase tracking-wider block mb-2 group-focus-within:text-[#E07B5B] transition-colors">
                            Interest
                          </label>
                          <select
                            value={formState.interest}
                            onChange={(e) =>
                              setFormState({ ...formState, interest: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-[#F5F3EF] rounded-lg border-2 border-transparent focus:border-[#E07B5B] focus:outline-none transition-all duration-300 hover:bg-[#f0ede8] cursor-pointer"
                          >
                            <option value="">Select an option</option>
                            <option value="vendor">Becoming a Vendor</option>
                            <option value="events">Hosting an Event</option>
                            <option value="partnership">Partnership</option>
                            <option value="general">General Inquiry</option>
                          </select>
                        </div>
                      </div>

                      <div className="group">
                        <label className="text-xs text-[#999] uppercase tracking-wider block mb-2 group-focus-within:text-[#E07B5B] transition-colors">
                          Message *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formState.message}
                          onChange={(e) =>
                            setFormState({ ...formState, message: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-[#F5F3EF] rounded-lg border-2 border-transparent focus:border-[#E07B5B] focus:outline-none transition-all duration-300 hover:bg-[#f0ede8] resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      {formStatus === 'error' && (
                        <div className="p-4 bg-red-50 rounded-lg text-red-600 text-sm animate-shake">
                          {errorMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={formStatus === 'loading'}
                        className="w-full bg-[#E07B5B] text-white py-4 rounded-full font-medium hover:bg-[#c96a4d] hover:shadow-lg hover:shadow-[#E07B5B]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                      >
                        {formStatus === 'loading' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 group-hover:-rotate-12 transition-transform" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Footer - Editorial Magazine Style */}
        <footer className="px-6 md:px-12 py-16 border-t border-[#e5e2dc]">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-12 gap-8 mb-16">
              <div className="md:col-span-5">
                <a
                  href="#"
                  className="font-editorial text-2xl italic block mb-6 hover:text-[#E07B5B] transition-colors"
                >
                  Water Street Commons
                </a>
                <p className="text-[#666] leading-relaxed max-w-sm">
                  A Downtown Development Authority initiative bringing local makers together by
                  the Thunder Bay River.
                </p>
              </div>
              <div className="md:col-span-3 md:col-start-7">
                <p className="text-xs text-[#999] uppercase tracking-[0.2em] mb-6">Navigate</p>
                <div className="space-y-3">
                  {['About', 'Spaces', 'Vendors', 'Visit', 'Contact'].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="block text-sm text-[#666] hover:text-[#E07B5B] hover:translate-x-1 transition-all duration-300"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-[#999] uppercase tracking-[0.2em] mb-6">Social</p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 border border-[#e5e2dc] flex items-center justify-center text-[#666] hover:border-[#E07B5B] hover:text-[#E07B5B] transition-all duration-300"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 border border-[#e5e2dc] flex items-center justify-center text-[#666] hover:border-[#E07B5B] hover:text-[#E07B5B] transition-all duration-300"
                  >
                    <Facebook size={18} />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[#e5e2dc]">
              <p className="text-xs text-[#999] tracking-wide">
                © 2026 WATER STREET COMMONS. DOWNTOWN ALPENA DEVELOPMENT AUTHORITY.
              </p>
              <div className="flex gap-8 text-xs text-[#999] tracking-wide">
                <a href="#" className="hover:text-[#E07B5B] transition-colors">
                  PRIVACY
                </a>
                <a href="#" className="hover:text-[#E07B5B] transition-colors">
                  TERMS
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* CSS Animations */}
      <style>{`
        .font-editorial {
          font-family: 'Playfair Display', Georgia, serif;
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-left {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fade-up {
          animation: fade-up 0.8s ease-out forwards;
        }

        .animate-fade-down {
          animation: fade-down 0.6s ease-out forwards;
        }

        .animate-fade-left {
          animation: fade-left 0.8s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  )
}
