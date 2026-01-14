import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Calendar, ArrowRight, User, Star, ArrowUpRight } from 'lucide-react'
import { blogPosts } from '../data/blog-posts'

export const Route = createFileRoute('/blog/')({
  component: BlogPage,
})

function BlogPage() {
  const categories = Array.from(new Set(blogPosts.map((post) => post.category)))
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const filteredPosts =
    selectedCategory === 'All'
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[#F5F5DC] text-[#3D5A3D] selection:bg-[#9D4A4A] selection:text-white font-sans overflow-x-hidden">
      {/* 
        THE MASTER GRID 
        A shared-border system where every element is a "block"
      */}
      <main className="max-w-[1600px] mx-auto border-x border-[#3D5A3D]">
        
        {/* TOP BLOCK: NAV & HEADER */}
        <section className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D]">
          <div className="md:col-span-8 p-4 md:p-8 lg:p-16 border-r border-[#3D5A3D] bg-white flex flex-col justify-between min-h-[300px] md:min-h-[400px]">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 md:mb-0">
              <Link to="/" className="text-xs md:text-[10px] font-black tracking-[0.4em] uppercase hover:text-[#9D4A4A] transition-colors">
                Water Street Commons
              </Link>
              <div className="flex flex-wrap gap-4 md:gap-8">
                {['About', 'Visit', 'Blog', 'Contact'].map(item => {
                  const isBlog = item === 'Blog'
                  const isAbout = item === 'About'
                  return (
                    <Link 
                      key={item} 
                      to={isBlog ? '/blog' : isAbout ? '/about' : `/#${item.toLowerCase()}`} 
                      className={`text-xs md:text-[10px] font-bold tracking-widest uppercase transition-colors min-h-[44px] flex items-center ${isBlog ? 'text-[#9D4A4A]' : 'hover:text-[#9D4A4A]'}`}
                    >
                      {item}
                    </Link>
                  )
                })}
              </div>
            </div>
            
            <div>
              <h1 className="font-editorial text-4xl md:text-7xl lg:text-9xl italic leading-[0.8] -ml-1">
                The <span className="text-[#9D4A4A]">Blog</span>
              </h1>
              <p className="mt-4 md:mt-8 text-sm md:text-base font-bold tracking-widest uppercase text-[#999] max-w-md text-balance">
                Vol. 01 — Riverside Dispatches, Vendor Spotlights, and Local Lore.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#9D4A4A] p-6 md:p-8 flex flex-col items-center justify-center text-white text-center relative overflow-hidden group min-h-[200px] md:min-h-0">
            <div className="relative z-10 animate-spin-slow hidden md:block">
              <Star size={120} strokeWidth={1} fill="currentColor" className="opacity-20" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12">
              <p className="text-xs md:text-[10px] font-black tracking-[0.3em] uppercase mb-3 md:mb-4">Established</p>
              <p className="font-editorial text-3xl md:text-5xl italic leading-none">2026</p>
            </div>
          </div>
        </section>

        {/* FILTER BLOCK */}
        <section className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D]">
          <div className="md:col-span-2 p-4 md:p-6 border-r border-[#3D5A3D] bg-[#3D5A3D] text-white flex items-center justify-center min-h-[60px]">
            <p className="text-xs md:text-[10px] font-black tracking-[0.3em] uppercase rotate-0 md:-rotate-90 whitespace-nowrap">Filter Topics</p>
          </div>
          <div className="md:col-span-10 flex flex-wrap bg-white">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`flex-grow px-4 py-4 md:px-8 md:py-6 text-xs md:text-[10px] font-black tracking-[0.3em] uppercase border-r border-[#3D5A3D] last:border-r-0 transition-all duration-300 min-h-[44px] ${
                selectedCategory === 'All' ? 'bg-[#9D4A4A] text-white' : 'hover:bg-[#F5F5DC]'
              }`}
            >
              All Stories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-grow px-4 py-4 md:px-8 md:py-6 text-xs md:text-[10px] font-black tracking-[0.3em] uppercase border-r border-[#3D5A3D] last:border-r-0 transition-all duration-300 min-h-[44px] ${
                  selectedCategory === category ? 'bg-[#9D4A4A] text-white' : 'hover:bg-[#F5F5DC]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* POSTS BLOCK GRID */}
        <section className="grid grid-cols-1 md:grid-cols-12">
          {filteredPosts.map((post, index) => {
            const isWide = index === 0 || index === 3
            const isTall = index === 1
            
            return (
              <div
                key={post.slug}
                className={`
                  border-b border-r border-[#3D5A3D] group relative bg-white overflow-hidden
                  ${isWide ? 'md:col-span-8' : 'md:col-span-4'}
                  ${isTall ? 'md:row-span-2' : ''}
                  ${(index + 1) % 12 === 0 ? 'md:border-r-0' : ''}
                `}
              >
                <Link to="/blog/$slug" params={{ slug: post.slug }} className="flex flex-col h-full">
                  <div className={`overflow-hidden relative ${isTall ? 'h-[400px] md:h-full' : 'aspect-[16/9]'}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-[#9D4A4A] text-white rounded-full flex items-center justify-center">
                        <ArrowUpRight size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-8 flex flex-col flex-grow border-t border-[#3D5A3D]">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4 md:mb-6">
                      <span className="text-xs md:text-[9px] font-black tracking-[0.2em] uppercase bg-[#3D5A3D] text-white px-3 py-1.5">
                        {post.category}
                      </span>
                      <span className="text-xs md:text-[9px] font-bold text-[#999] tracking-widest uppercase">
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <h2 className={`font-editorial italic group-hover:text-[#9D4A4A] transition-colors duration-300 leading-none mb-4 md:mb-6 ${isWide ? 'text-3xl md:text-5xl lg:text-7xl' : 'text-2xl md:text-3xl'}`}>
                      {post.title}
                    </h2>

                    <p className={`text-[#666] leading-relaxed font-light mb-6 md:mb-8 text-balance ${isWide ? 'text-base md:text-lg max-w-xl' : 'text-sm md:text-base'}`}>
                      {post.excerpt}
                    </p>

                    <div className="mt-auto pt-4 md:pt-6 border-t border-[#3D5A3D]/10 flex items-center gap-3 md:gap-4 text-xs md:text-[10px] font-black tracking-[0.2em] uppercase min-h-[44px]">
                      <div className="w-2 h-2 bg-[#9D4A4A] animate-pulse" />
                      Read Article
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}

          {/* FILLER BLOCK FOR GRID INTEGRITY */}
          <div className="md:col-span-4 border-b border-[#3D5A3D] bg-[#F5F5DC] p-6 md:p-12 flex flex-col items-center justify-center text-center">
            <Star size={32} className="md:w-10 md:h-10 text-[#9D4A4A] mb-4 md:mb-6" />
            <h3 className="font-editorial text-xl md:text-2xl italic mb-3 md:mb-4 text-[#3D5A3D]">Stay Updated</h3>
            <p className="text-xs md:text-[10px] font-bold text-[#999] uppercase tracking-widest leading-relaxed text-balance px-4 md:px-0">Join our weekly newsletter for more stories from the commons.</p>
            <div className="mt-6 md:mt-8 w-full max-w-xs">
              <input type="email" placeholder="EMAIL" className="w-full bg-transparent border-b border-[#3D5A3D] p-3 text-base md:text-sm focus:outline-none focus:border-[#9D4A4A] min-h-[44px]" />
            </div>
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
