import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Star, ArrowRight, ArrowUpRight, Users, MapPin, Heart } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F5DC] text-[#3D5A3D] selection:bg-[#9D4A4A] selection:text-white font-sans overflow-x-hidden">
      <main className="max-w-[1600px] mx-auto border-x border-[#3D5A3D]">
        
        {/* TOP BLOCK: NAV & HEADER */}
        <section className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D]">
          <div className="md:col-span-8 p-4 md:p-8 lg:p-16 border-r border-[#3D5A3D] bg-white flex flex-col justify-between min-h-[300px] md:min-h-[400px]">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 md:mb-0">
              <Link to="/" className="text-xs md:text-[10px] font-black tracking-[0.4em] uppercase hover:text-[#9D4A4A] transition-colors">
                Water Street Commons
              </Link>
              <div className="flex flex-wrap gap-4 md:gap-8">
                {['About', 'Visit', 'Blog', 'Contact'].map(item => (
                  <Link 
                    key={item} 
                    to={item === 'Blog' ? '/blog' : item === 'About' ? '/about' : `/#${item.toLowerCase()}`} 
                    className={`text-xs md:text-[10px] font-bold tracking-widest uppercase transition-colors min-h-[44px] flex items-center ${item === 'About' ? 'text-[#9D4A4A]' : 'hover:text-[#9D4A4A]'}`}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            
            <div>
              <h1 className="font-editorial text-4xl md:text-7xl lg:text-9xl italic leading-[0.8] -ml-1">
                Our <span className="text-[#9D4A4A]">Story</span>
              </h1>
              <p className="mt-4 md:mt-8 text-sm md:text-base font-bold tracking-widest uppercase text-[#999] max-w-md text-balance leading-relaxed">
                A colorful riverside nook in Downtown Bula. Five tiny shops for local makers to grow, share, and sparkle.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#3D5A3D] p-6 md:p-8 flex flex-col items-center justify-center text-white text-center relative overflow-hidden group min-h-[200px] md:min-h-0">
            <div className="relative z-10 animate-spin-slow opacity-20 hidden md:block">
              <Star size={160} strokeWidth={1} fill="currentColor" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12">
              <p className="text-xs md:text-[10px] font-black tracking-[0.3em] uppercase mb-3 md:mb-4 text-[#9D4A4A]">Our Purpose</p>
              <p className="font-editorial text-2xl md:text-4xl italic leading-tight">Community <br/> Through <br/> Craft</p>
            </div>
          </div>
        </section>

        {/* MISSION BLOCKS */}
        <section className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D]">
          <div className="md:col-span-4 p-6 md:p-12 border-r border-[#3D5A3D] bg-[#9D4A4A] text-white">
            <Heart size={28} className="md:w-8 md:h-8 mb-6 md:mb-8" />
            <h3 className="font-editorial text-3xl md:text-4xl italic mb-4 md:mb-6 leading-tight text-white">Why we exist</h3>
            <p className="text-sm md:text-base font-bold tracking-widest uppercase leading-loose opacity-80 text-balance">
              An initiative by the Downtown Development Authority to activate underutilized riverfront space and provide affordable retail opportunities for emerging entrepreneurs.
            </p>
          </div>
          
          <div className="md:col-span-8 p-6 md:p-12 lg:p-24 bg-white flex items-center">
            <div className="max-w-2xl">
              <p className="text-xs md:text-[10px] font-black tracking-[0.3em] uppercase text-[#9D4A4A] mb-4 md:mb-8">The Vision</p>
              <h2 className="font-editorial text-3xl md:text-4xl lg:text-6xl italic leading-tight mb-6 md:mb-12 text-balance">
                "We believe in the power of <span className="text-[#9D4A4A]">small-scale retail</span> to build big-scale community connections."
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 pt-8 md:pt-12 border-t border-[#3D5A3D]/10">
                <div>
                  <p className="text-xs md:text-[10px] font-black tracking-[0.2em] uppercase mb-3 md:mb-4 text-[#3D5A3D]">Incubation</p>
                  <p className="text-sm md:text-base text-[#666] leading-relaxed text-balance">Lowering the barrier to entry for local makers to test their first brick-and-mortar concepts.</p>
                </div>
                <div>
                  <p className="text-xs md:text-[10px] font-black tracking-[0.2em] uppercase mb-3 md:mb-4 text-[#3D5A3D]">Activation</p>
                  <p className="text-sm md:text-base text-[#666] leading-relaxed text-balance">Turning a riverside path into a destination for shopping, sipping, and strolling.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* IMAGE BLOCK */}
        <section className="border-b border-[#3D5A3D] bg-white overflow-hidden aspect-[16/9] md:aspect-[21/9]">
          <img 
            src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop" 
            className="w-full h-full object-cover transition-all duration-1000"
            alt="Water Street"
          />
        </section>

        {/* TEAM / VENDORS BLOCK */}
        <section className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D]">
          <div className="md:col-span-6 p-6 md:p-12 lg:p-24 border-r border-[#3D5A3D] bg-white">
            <Users size={28} className="md:w-8 md:h-8 text-[#9D4A4A] mb-6 md:mb-8" />
            <h3 className="font-editorial text-3xl md:text-4xl lg:text-5xl italic mb-6 md:mb-8 leading-tight">Five Tiny Shops</h3>
            <p className="text-base md:text-lg text-[#666] leading-relaxed mb-8 md:mb-12 text-balance">
              Our 2026 season features a curated mix of artisans, bakers, and creators. Each space is uniquely designed to showcase the best of Bula's local talent.
            </p>
            <Link to="/blog" className="inline-flex items-center gap-3 md:gap-4 text-xs md:text-[10px] font-black tracking-[0.3em] uppercase group min-h-[44px]">
              Meet our vendors
              <div className="w-10 h-10 border border-[#3D5A3D] rounded-full flex items-center justify-center group-hover:bg-[#3D5A3D] group-hover:text-white transition-all duration-500">
                <ArrowRight size={18} className="md:w-4 md:h-4" />
              </div>
            </Link>
          </div>

          <div className="md:col-span-6 p-6 md:p-12 lg:p-24 bg-[#F5F5DC]">
            <MapPin size={28} className="md:w-8 md:h-8 text-[#9D4A4A] mb-6 md:mb-8" />
            <h3 className="font-editorial text-3xl md:text-4xl lg:text-5xl italic mb-6 md:mb-8 leading-tight text-[#3D5A3D]">The Location</h3>
            <p className="text-base md:text-lg text-[#666] leading-relaxed mb-8 md:mb-12 text-balance">
              Situated right on the Thunder Bay River, Water Street Commons is the anchor of Bula's downtown social district.
            </p>
            <a href="#visit" className="inline-flex items-center gap-3 md:gap-4 text-xs md:text-[10px] font-black tracking-[0.3em] uppercase group min-h-[44px]">
              Plan your visit
              <div className="w-10 h-10 border border-[#3D5A3D] rounded-full flex items-center justify-center group-hover:bg-[#3D5A3D] group-hover:text-white transition-all duration-500 text-[#3D5A3D]">
                <ArrowUpRight size={18} className="md:w-4 md:h-4" />
              </div>
            </a>
          </div>
        </section>

        {/* FOOTER BLOCK */}
        <footer className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D] bg-[#3D5A3D] text-white">
          <div className="md:col-span-8 p-6 md:p-12 lg:p-24 border-r border-white/10">
            <h4 className="font-editorial text-3xl md:text-5xl lg:text-7xl italic mb-6 md:mb-8 leading-none">Water Street <br/> Commons</h4>
            <div className="flex flex-wrap gap-6 md:gap-8 opacity-50">
              {['Instagram', 'Facebook', 'Twitter', 'Pinterest'].map(social => (
                <a key={social} href="#" className="text-xs md:text-[10px] font-black tracking-[0.3em] uppercase hover:text-white transition-colors min-h-[44px] flex items-center">{social}</a>
              ))}
            </div>
          </div>
          <div className="md:col-span-4 p-6 md:p-12 flex flex-col justify-between bg-[#3D5A3D]">
            <p className="text-xs md:text-[10px] font-bold tracking-[0.3em] uppercase leading-loose text-white/40 text-balance">
              A Downtown Development Authority initiative bringing local makers together by the Thunder Bay River.
            </p>
            <p className="text-xs md:text-[9px] font-bold tracking-[0.2em] uppercase text-white/20 mt-8 md:mt-12">
              © 2026 Bula MI
            </p>
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
