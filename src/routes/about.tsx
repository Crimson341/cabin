import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Star, ArrowRight, ArrowUpRight, Users, MapPin, Heart } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#1a1a1a] selection:bg-[#E07B5B] selection:text-white font-sans overflow-x-hidden">
      <main className="max-w-[1600px] mx-auto border-x border-[#1a1a1a]">
        
        {/* TOP BLOCK: NAV & HEADER */}
        <section className="grid grid-cols-1 md:grid-cols-12 border-b border-[#1a1a1a]">
          <div className="md:col-span-8 p-8 md:p-16 border-r border-[#1a1a1a] bg-white flex flex-col justify-between min-h-[400px]">
            <div className="flex justify-between items-start">
              <Link to="/" className="text-[10px] font-black tracking-[0.4em] uppercase hover:text-[#E07B5B] transition-colors">
                Water Street Commons
              </Link>
              <div className="flex gap-8">
                {['About', 'Visit', 'Blog', 'Contact'].map(item => (
                  <Link 
                    key={item} 
                    to={item === 'Blog' ? '/blog' : item === 'About' ? '/about' : `/#${item.toLowerCase()}`} 
                    className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${item === 'About' ? 'text-[#E07B5B]' : 'hover:text-[#E07B5B]'}`}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            
            <div>
              <h1 className="font-editorial text-7xl md:text-9xl italic leading-[0.8] -ml-1">
                Our <span className="text-[#E07B5B]">Story</span>
              </h1>
              <p className="mt-8 text-sm font-bold tracking-widest uppercase text-[#999] max-w-md text-balance leading-relaxed">
                A colorful riverside nook in Downtown Alpena. Five tiny shops for local makers to grow, share, and sparkle.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#1a1a1a] p-8 flex flex-col items-center justify-center text-white text-center relative overflow-hidden group">
            <div className="relative z-10 animate-spin-slow opacity-20">
              <Star size={160} strokeWidth={1} fill="currentColor" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
              <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-4 text-[#E07B5B]">Our Purpose</p>
              <p className="font-editorial text-4xl italic leading-tight">Community <br/> Through <br/> Craft</p>
            </div>
          </div>
        </section>

        {/* MISSION BLOCKS */}
        <section className="grid grid-cols-1 md:grid-cols-12 border-b border-[#1a1a1a]">
          <div className="md:col-span-4 p-12 border-r border-[#1a1a1a] bg-[#E07B5B] text-white">
            <Heart size={32} className="mb-8" />
            <h3 className="font-editorial text-4xl italic mb-6 leading-tight text-white">Why we exist</h3>
            <p className="text-sm font-bold tracking-widest uppercase leading-loose opacity-80">
              An initiative by the Downtown Development Authority to activate underutilized riverfront space and provide affordable retail opportunities for emerging entrepreneurs.
            </p>
          </div>
          
          <div className="md:col-span-8 p-12 md:p-24 bg-white flex items-center">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#E07B5B] mb-8">The Vision</p>
              <h2 className="font-editorial text-4xl md:text-6xl italic leading-tight mb-12">
                "We believe in the power of <span className="text-[#E07B5B]">small-scale retail</span> to build big-scale community connections."
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-12 border-t border-[#1a1a1a]/10">
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-4 text-[#1a1a1a]">Incubation</p>
                  <p className="text-sm text-[#666] leading-relaxed">Lowering the barrier to entry for local makers to test their first brick-and-mortar concepts.</p>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-4 text-[#1a1a1a]">Activation</p>
                  <p className="text-sm text-[#666] leading-relaxed">Turning a riverside path into a destination for shopping, sipping, and strolling.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* IMAGE BLOCK */}
        <section className="border-b border-[#1a1a1a] bg-white overflow-hidden aspect-[21/9]">
          <img 
            src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop" 
            className="w-full h-full object-cover transition-all duration-1000"
            alt="Water Street"
          />
        </section>

        {/* TEAM / VENDORS BLOCK */}
        <section className="grid grid-cols-1 md:grid-cols-12 border-b border-[#1a1a1a]">
          <div className="md:col-span-6 p-12 md:p-24 border-r border-[#1a1a1a] bg-white">
            <Users size={32} className="text-[#E07B5B] mb-8" />
            <h3 className="font-editorial text-5xl italic mb-8 leading-tight">Five Tiny Shops</h3>
            <p className="text-lg text-[#666] leading-relaxed mb-12">
              Our 2026 season features a curated mix of artisans, bakers, and creators. Each space is uniquely designed to showcase the best of Alpena's local talent.
            </p>
            <Link to="/blog" className="inline-flex items-center gap-4 text-[10px] font-black tracking-[0.3em] uppercase group">
              Meet our vendors
              <div className="w-10 h-10 border border-[#1a1a1a] rounded-full flex items-center justify-center group-hover:bg-[#1a1a1a] group-hover:text-white transition-all duration-500">
                <ArrowRight size={16} />
              </div>
            </Link>
          </div>

          <div className="md:col-span-6 p-12 md:p-24 bg-[#F5F3EF]">
            <MapPin size={32} className="text-[#E07B5B] mb-8" />
            <h3 className="font-editorial text-5xl italic mb-8 leading-tight text-[#1a1a1a]">The Location</h3>
            <p className="text-lg text-[#666] leading-relaxed mb-12">
              Situated right on the Thunder Bay River, Water Street Commons is the anchor of Alpena's downtown social district.
            </p>
            <a href="#visit" className="inline-flex items-center gap-4 text-[10px] font-black tracking-[0.3em] uppercase group">
              Plan your visit
              <div className="w-10 h-10 border border-[#1a1a1a] rounded-full flex items-center justify-center group-hover:bg-[#1a1a1a] group-hover:text-white transition-all duration-500 text-[#1a1a1a]">
                <ArrowUpRight size={16} />
              </div>
            </a>
          </div>
        </section>

        {/* FOOTER BLOCK */}
        <footer className="grid grid-cols-1 md:grid-cols-12 border-b border-[#1a1a1a] bg-[#1a1a1a] text-white">
          <div className="md:col-span-8 p-12 md:p-24 border-r border-white/10">
            <h4 className="font-editorial text-5xl md:text-7xl italic mb-8 leading-none">Water Street <br/> Commons</h4>
            <div className="flex flex-wrap gap-8 opacity-50">
              {['Instagram', 'Facebook', 'Twitter', 'Pinterest'].map(social => (
                <a key={social} href="#" className="text-[10px] font-black tracking-[0.3em] uppercase hover:text-white transition-colors">{social}</a>
              ))}
            </div>
          </div>
          <div className="md:col-span-4 p-12 flex flex-col justify-between bg-[#1a1a1a]">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase leading-loose text-white/40">
              A Downtown Development Authority initiative bringing local makers together by the Thunder Bay River.
            </p>
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/20 mt-12">
              © 2026 Alpena MI
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
