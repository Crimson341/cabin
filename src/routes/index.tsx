import { useState, useEffect, useRef } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ShoppingBag,
  Coffee,
  Users,
  Instagram,
  Facebook,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  Calendar,
  Star,
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

// Hook for scroll-triggered animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (ref.current) observer.unobserve(ref.current)
        }
      },
      { threshold }
    )

    observer.observe(ref.current)

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
  const [hasMounted, setHasMounted] = useState(false)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHasMounted(true)
  }, [])

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20
        const y = (e.clientY / window.innerHeight - 0.5) * 20
        containerRef.current.style.setProperty('--mouse-x', `${x}px`)
        containerRef.current.style.setProperty('--mouse-y', `${y}px`)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F5F5DC] text-[#3D5A3D] selection:bg-[#9D4A4A] selection:text-white overflow-x-hidden"
      style={{ '--mouse-x': '0px', '--mouse-y': '0px' } as any}
    >
      {/* Navigation */}
      <nav
        className={`px-6 md:px-12 py-6 border-b border-[#3D5A3D] bg-white sticky top-0 z-50 transition-all duration-700 ease-out ${
          hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-[10px] font-black tracking-[0.4em] hover:text-[#9D4A4A] transition-colors duration-300 uppercase"
          >
            WATER STREET COMMONS
          </Link>

          <div className="hidden md:flex items-center gap-12">
            {['About', 'Spaces', 'Vendors', 'Visit', 'Blog', 'Contact'].map((item, i) => {
              const isBlog = item === 'Blog'
              const isAbout = item === 'About'
              const Component = (isBlog || isAbout) ? Link : 'a'
              const props = isBlog
                ? { to: '/blog' }
                : isAbout
                ? { to: '/about' }
                : { href: `#${item.toLowerCase()}` }
              return (
                <Component
                  key={item}
                  {...props}
                  className={`text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 hover:-translate-y-0.5 ${
                    isBlog || isAbout
                      ? 'text-[#9D4A4A] hover:text-[#9D4A4A]'
                      : 'text-[#666] hover:text-[#3D5A3D]'
                  }`}
                >
                  {item}
                </Component>
              )
            })}
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
        className={`fixed inset-0 z-[60] bg-[#F5F5DC] p-8 pt-24 flex flex-col gap-6 md:hidden transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <button className="absolute top-6 right-6" onClick={() => setMobileMenuOpen(false)}>
          <X size={24} />
        </button>
        {['About', 'Spaces', 'Vendors', 'Visit', 'Blog', 'Contact'].map((item, i) => {
          const isBlog = item === 'Blog'
          const isAbout = item === 'About'
          const Component = (isBlog || isAbout) ? Link : 'a'
          const props = isBlog
            ? { to: '/blog' }
            : isAbout
            ? { to: '/about' }
            : { href: `#${item.toLowerCase()}` }
          return (
            <Component
              key={item}
              {...props}
              className={`text-4xl font-editorial italic transition-all duration-300 ${
                isBlog || isAbout ? 'text-[#9D4A4A]' : ''
              }`}
              style={{
                opacity: mobileMenuOpen ? 1 : 0,
                transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(20px)',
                transitionDelay: `${i * 100}ms`,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </Component>
          )
        })}
      </div>

      <main className="max-w-[1600px] mx-auto border-x border-[#3D5A3D]">
        {/* HERO BLOCK ARCHITECTURE */}
        <section className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D]">
          {/* Block 1: Title */}
          <div className="md:col-span-9 p-8 md:p-16 lg:p-24 border-r border-[#3D5A3D] bg-white flex flex-col justify-between min-h-[500px]">
            <AnimatedSection delay={100}>
              <div className="flex items-center gap-4 mb-12">
                <span className="text-[10px] font-black tracking-[0.4em] uppercase px-4 py-2 border border-[#3D5A3D] text-[#3D5A3D]">
                  Established 2026
                </span>
                <span className="text-[10px] font-bold text-[#999] tracking-widest uppercase">
                  Bula, MI
                </span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <h1 className="font-editorial text-7xl md:text-9xl lg:text-[180px] italic leading-[0.75] tracking-tighter -ml-2">
                Water <br />
                Street <br />
                <span className="text-[#9D4A4A] not-italic font-medium">Commons</span>
              </h1>
            </AnimatedSection>
          </div>

          {/* Block 2: Utility/Star */}
          <div className="md:col-span-3 bg-[#3D5A3D] text-white p-8 flex flex-col items-center justify-center relative overflow-hidden group border-b md:border-b-0 border-[#3D5A3D]">
            <div className="relative z-10 animate-spin-slow opacity-20">
              <Star size={180} strokeWidth={1} fill="currentColor" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-6 text-[#9D4A4A]">Our Purpose</p>
              <p className="font-editorial text-4xl italic leading-tight">Sip, Shop <br/> & Stroll</p>
              <div className="mt-12 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-[#9D4A4A] group-hover:border-[#9D4A4A] transition-all duration-500">
                <ArrowRight size={20} className="-rotate-45" />
              </div>
            </div>
          </div>
        </section>

        {/* HERO ROW 2: IMAGE & CONTENT */}
        <section className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D]">
          {/* Block 3: Value Prop */}
          <div className="md:col-span-4 p-8 md:p-12 border-r border-[#3D5A3D] bg-[#F5F5DC] flex flex-col justify-between">
            <AnimatedSection delay={300}>
              <p className="text-xl md:text-2xl font-editorial italic leading-relaxed text-[#3D5A3D] mb-12">
                "A colorful riverside nook with five tiny shops for local makers to grow, share, and sparkle."
              </p>
              <div className="flex flex-col gap-4">
                <Link
                  to="/about"
                  className="group flex items-center justify-between bg-[#3D5A3D] text-white px-8 py-6 text-[10px] font-black tracking-[0.3em] uppercase hover:bg-[#9D4A4A] transition-all duration-500"
                >
                  The Story
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                </Link>
                <a
                  href="#contact"
                  className="flex items-center justify-between border border-[#3D5A3D] px-8 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-[#3D5A3D] hover:bg-white transition-all duration-500"
                >
                  Apply for 2026
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </AnimatedSection>
          </div>

          {/* Block 4: Hero Image */}
          <div className="md:col-span-8 h-[400px] md:h-[600px] bg-white overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2000&auto=format&fit=crop"
              alt="Riverside View"
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
            />
          </div>
        </section>

        {/* ABOUT BLOCK */}
        <section id="about" className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D]">
          <div className="md:col-span-8 p-8 md:p-16 lg:p-24 border-r border-[#3D5A3D] bg-white">
            <AnimatedSection>
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#9D4A4A] mb-8">The Story</p>
              <h2 className="font-editorial text-4xl md:text-6xl lg:text-8xl italic leading-[1] mb-12">
                Where makers <span className="text-[#9D4A4A]">grow</span>, share, and <span className="text-[#9D4A4A]">sparkle</span>
              </h2>
              <div className="flex flex-wrap gap-4 mt-12">
                {['Local', 'Riverside', 'Community', 'Craft'].map((tag) => (
                  <span key={tag} className="px-6 py-2 border border-[#3D5A3D]/10 text-[10px] font-bold tracking-widest uppercase">{tag}</span>
                ))}
              </div>
            </AnimatedSection>
          </div>
          
          <div className="md:col-span-4 p-8 md:p-12 bg-[#3D5A3D] text-white flex flex-col justify-end">
            <AnimatedSection delay={200}>
              <div className="border-l-2 border-[#9D4A4A] pl-8">
                <p className="text-sm font-bold tracking-widest uppercase leading-loose opacity-60 mb-12">
                  An initiative by the Downtown Development Authority to activate underutilized riverfront space and provide affordable retail opportunities for emerging entrepreneurs.
                </p>
                <Link to="/about" className="group inline-flex items-center gap-4 text-[10px] font-black tracking-[0.3em] uppercase">
                  Learn More
                  <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-[#3D5A3D] transition-all duration-500">
                    <ArrowRight size={16} />
                  </div>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* SPACES GRID BLOCKS */}
        <section id="spaces" className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D]">
          <div className="md:col-span-4 p-8 md:p-12 border-r border-[#3D5A3D] bg-[#F5F5DC]">
            <AnimatedSection>
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#9D4A4A] mb-8 text-center md:text-left">The Spaces</p>
              <h2 className="font-editorial text-4xl md:text-6xl italic leading-none text-center md:text-left">What's at the Commons?</h2>
            </AnimatedSection>
          </div>
          
          <div className="md:col-span-8 border-b md:border-b-0 border-[#3D5A3D] group relative overflow-hidden bg-white">
            <Link to="/blog" className="grid grid-cols-1 md:grid-cols-2 h-full">
              <div className="aspect-square md:aspect-auto overflow-hidden border-r border-[#3D5A3D]/10">
                <img src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" alt="The Shops" />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="font-editorial text-6xl text-[#3D5A3D]/10 mb-4">01</span>
                <h3 className="font-editorial text-3xl md:text-4xl italic mb-6 group-hover:text-[#9D4A4A] transition-colors">The Shops</h3>
                <p className="text-sm text-[#666] leading-relaxed uppercase tracking-wider mb-8">Five tiny-but-mighty retail spaces for artisans, bakers, and makers.</p>
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-[#9D4A4A]">
                  Now Accepting Applications
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D]">
          <div className="md:col-span-6 border-r border-[#3D5A3D] group bg-white">
            <div className="flex flex-col h-full">
              <div className="aspect-video overflow-hidden border-b border-[#3D5A3D]/10">
                <img src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" alt="Anchor Shed" />
              </div>
              <div className="p-8 md:p-12">
                <span className="font-editorial text-6xl text-[#3D5A3D]/10 mb-4">02</span>
                <h3 className="font-editorial text-3xl italic mb-4">Anchor Shed</h3>
                <p className="text-sm text-[#666] leading-relaxed uppercase tracking-wider">Our central hub for yummy drinks and treats. The heart of our social district.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 group bg-white">
            <div className="flex flex-col h-full">
              <div className="aspect-video overflow-hidden border-b border-[#3D5A3D]/10">
                <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" alt="Cozy Square" />
              </div>
              <div className="p-8 md:p-12">
                <span className="font-editorial text-6xl text-[#3D5A3D]/10 mb-4">03</span>
                <h3 className="font-editorial text-3xl italic mb-4">Cozy Square</h3>
                <p className="text-sm text-[#666] leading-relaxed uppercase tracking-wider">Fire pits, string lights, and plenty of room to sit and chat.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL DISTRICT BLOCK */}
        <section className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D] bg-[#3D5A3D] text-white">
          <div className="md:col-span-7 p-8 md:p-16 lg:p-24 border-r border-white/10 flex flex-col justify-center">
            <AnimatedSection>
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#9D4A4A] mb-8">Official Social District</p>
              <h2 className="font-editorial text-5xl md:text-7xl lg:text-9xl italic leading-[0.85] mb-12">
                Sip, Shop <br/> <span className="text-[#9D4A4A]">& Stroll</span>
              </h2>
              <p className="text-sm font-bold tracking-[0.2em] uppercase leading-loose text-white/40 max-w-md">
                Grab a cozy beverage from our anchor shed and enjoy it while you browse the shops or wander the river trail.
              </p>
            </AnimatedSection>
          </div>
          <div className="md:col-span-5 h-[400px] md:h-auto overflow-hidden">
            <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover transition-all duration-1000" alt="Social District" />
          </div>
        </section>

        {/* VISIT BLOCK */}
        <section id="visit" className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D]">
          <div className="md:col-span-4 p-8 md:p-12 border-r border-[#3D5A3D] bg-white flex flex-col justify-between">
            <AnimatedSection>
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#9D4A4A] mb-8">Visit</p>
              <h2 className="font-editorial text-4xl md:text-6xl italic leading-none mb-12 text-[#3D5A3D]">Plan Your Visit</h2>
              <div className="w-20 h-20 border border-[#3D5A3D]/10 rounded-full flex items-center justify-center animate-spin-slow">
                <Star className="text-[#9D4A4A]" size={32} />
              </div>
            </AnimatedSection>
          </div>

          <div className="md:col-span-4 p-8 md:p-12 border-r border-[#3D5A3D] bg-white flex flex-col justify-center">
            <AnimatedSection delay={100}>
              <div className="flex items-center gap-4 mb-6">
                <Calendar size={20} className="text-[#9D4A4A]" />
                <span className="text-[10px] font-black tracking-widest uppercase">Season</span>
              </div>
              <p className="font-editorial text-4xl italic mb-2">May — October</p>
              <p className="text-[10px] font-bold text-[#999] uppercase tracking-widest">2026 Season</p>
            </AnimatedSection>
          </div>

          <div className="md:col-span-4 p-8 md:p-12 bg-white flex flex-col justify-center">
            <AnimatedSection delay={200}>
              <div className="flex items-center gap-4 mb-6">
                <Clock size={20} className="text-[#9D4A4A]" />
                <span className="text-[10px] font-black tracking-widest uppercase">Hours</span>
              </div>
              <div className="space-y-4">
                {[
                  ['Mon – Thu', '10am – 6pm'],
                  ['Fri – Sat', '10am – 8pm'],
                  ['Sunday', '11am – 5pm'],
                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between border-b border-[#3D5A3D]/5 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#999]">{day}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#3D5A3D]">{hours}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA / JOIN BLOCK */}
        <section className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D] bg-[#9D4A4A] text-white">
          <div className="md:col-span-12 p-12 md:p-24 lg:p-32 text-center">
            <AnimatedSection>
              <p className="text-[10px] font-black tracking-[0.4em] uppercase mb-8">Join the Community</p>
              <h2 className="font-editorial text-5xl md:text-7xl lg:text-[150px] leading-[0.8] mb-12 italic">Become a <br/> <span className="not-italic">Vendor</span></h2>
              <p className="text-sm font-bold tracking-widest uppercase leading-loose opacity-80 max-w-2xl mx-auto mb-16">
                We're looking for passionate makers, bakers, and creators to join our 2026 season. Built-in foot traffic and a supportive community.
              </p>
              <a href="#contact" className="inline-flex items-center gap-6 bg-[#3D5A3D] text-white px-12 py-6 text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white hover:text-[#3D5A3D] transition-all duration-500 group">
                Apply Now
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </a>
            </AnimatedSection>
          </div>
        </section>

        {/* CONTACT BLOCK */}
        <section id="contact" className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D]">
          <div className="md:col-span-5 p-8 md:p-16 border-r border-[#3D5A3D] bg-white">
            <AnimatedSection>
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#9D4A4A] mb-8">Contact</p>
              <h2 className="font-editorial text-4xl md:text-6xl italic leading-none mb-12">Get in Touch</h2>
              
              <div className="space-y-12">
                {[
                  { label: 'Email', value: 'hello@waterstreetcommons.com' },
                  { label: 'Phone', value: '989.356.6422' },
                  { label: 'Address', value: '123 Water Street, Bula, MI' },
                ].map((item) => (
                  <div key={item.label} className="group border-b border-[#3D5A3D]/5 pb-6">
                    <p className="text-[9px] font-black tracking-[0.3em] uppercase text-[#999] mb-2">{item.label}</p>
                    <p className="text-sm font-bold uppercase tracking-widest group-hover:text-[#9D4A4A] transition-colors">{item.value}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          <div className="md:col-span-7 p-8 md:p-16 bg-[#F5F5DC]">
            <AnimatedSection delay={200}>
              {formStatus === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-20 h-20 bg-[#9D4A4A]/10 rounded-full flex items-center justify-center mb-8 animate-bounce">
                    <CheckCircle className="text-[#9D4A4A]" size={32} />
                  </div>
                  <h3 className="font-editorial text-3xl italic mb-4 text-[#3D5A3D]">Message Sent!</h3>
                  <p className="text-[10px] font-bold text-[#999] uppercase tracking-widest mb-12 text-center md:text-left leading-relaxed max-w-sm">We'll get back to you about the 2026 season shortly.</p>
                  <button onClick={() => setFormStatus('idle')} className="text-[10px] font-black tracking-[0.3em] uppercase text-[#9D4A4A] hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black tracking-[0.3em] uppercase text-[#999]">Name</label>
                      <input required value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} type="text" className="w-full bg-white border border-[#3D5A3D]/10 p-4 text-[10px] font-bold focus:border-[#9D4A4A] focus:outline-none transition-colors" placeholder="YOUR NAME" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black tracking-[0.3em] uppercase text-[#999]">Email</label>
                      <input required value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} type="email" className="w-full bg-white border border-[#3D5A3D]/10 p-4 text-[10px] font-bold focus:border-[#9D4A4A] focus:outline-none transition-colors" placeholder="YOU@EXAMPLE.COM" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black tracking-[0.3em] uppercase text-[#999]">Interest</label>
                    <select value={formState.interest} onChange={(e) => setFormState({ ...formState, interest: e.target.value })} className="w-full bg-white border border-[#3D5A3D]/10 p-4 text-[10px] font-bold focus:border-[#9D4A4A] focus:outline-none transition-colors appearance-none cursor-pointer">
                      <option value="">SELECT AN OPTION</option>
                      <option value="vendor">BECOMING A VENDOR</option>
                      <option value="general">GENERAL INQUIRY</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black tracking-[0.3em] uppercase text-[#999]">Message</label>
                    <textarea required rows={4} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} className="w-full bg-white border border-[#3D5A3D]/10 p-4 text-[10px] font-bold focus:border-[#9D4A4A] focus:outline-none transition-colors resize-none" placeholder="TELL US ABOUT YOURSELF..."></textarea>
                  </div>
                  <button type="submit" disabled={formStatus === 'loading'} className="w-full bg-[#3D5A3D] text-white py-6 text-[10px] font-black tracking-[0.3em] uppercase hover:bg-[#9D4A4A] transition-all duration-500 disabled:opacity-50">
                    {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </AnimatedSection>
          </div>
        </section>

        {/* FOOTER BLOCK */}
        <footer className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D] bg-[#3D5A3D] text-white py-20 px-8 md:px-16">
          <div className="md:col-span-8 flex flex-col justify-between border-r border-white/10 pr-12">
            <div>
              <h4 className="font-editorial text-5xl md:text-7xl italic mb-12 leading-none">Water Street <br/> Commons</h4>
              <div className="flex flex-wrap gap-12">
                {['Instagram', 'Facebook', 'Twitter'].map(social => (
                  <a key={social} href="#" className="text-[10px] font-black tracking-[0.3em] uppercase hover:text-[#9D4A4A] transition-colors">{social}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col justify-between pl-0 md:pl-12 pt-12 md:pt-0">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase leading-loose text-white/40">
              A Downtown Development Authority initiative bringing local makers together by the Thunder Bay River.
            </p>
            <div className="mt-12 pt-12 border-t border-white/10 flex justify-between items-end">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/20">© 2026 Bula MI</p>
              <Link to="/" className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-[#3D5A3D] transition-all duration-500">
                <ArrowRight size={20} className="-rotate-45" />
              </Link>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        .font-editorial {
          font-family: 'Playfair Display', Georgia, serif;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
