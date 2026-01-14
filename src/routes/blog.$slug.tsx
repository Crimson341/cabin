import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { Calendar, ArrowLeft, Clock, User, Hash, Share2 } from 'lucide-react'
import { getBlogPost, blogPosts } from '../data/blog-posts'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPage,
  loader: async ({ params }) => {
    const post = getBlogPost(params.slug)
    if (!post) {
      throw notFound()
    }
    return { post }
  },
})

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

function BlogPostPage() {
  const { post } = Route.useLoaderData()
  
  // Find related posts (others in same category or just others)
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2)

  // Simple markdown-like content renderer
  const renderText = (text: string) => {
    const parts: React.ReactNode[] = []
    const boldRegex = /\*\*(.*?)\*\*/g
    let lastIndex = 0
    let match
    let key = 0

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      parts.push(
        <strong key={key++} className="font-bold text-[#3D5A3D]">
          {match[1]}
        </strong>
      )
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }
    return parts.length > 0 ? parts : text
  }

  const renderContent = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let currentParagraph: string[] = []
    let currentList: string[] = []

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={`p-${elements.length}`} className="text-[#666] leading-relaxed mb-6 md:mb-8 text-base md:text-lg lg:text-xl font-light text-balance">
            {renderText(currentParagraph.join(' '))}
          </p>
        )
        currentParagraph = []
      }
    }

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-none space-y-4 mb-10 ml-4">
            {currentList.map((item, i) => (
              <li key={i} className="flex items-start gap-3 md:gap-4 text-[#666] text-base md:text-lg font-light">
                <span className="mt-2 w-1.5 h-1.5 bg-[#9D4A4A] rounded-full shrink-0" />
                <span className="text-balance">{renderText(item)}</span>
              </li>
            ))}
          </ul>
        )
        currentList = []
      }
    }

    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        flushList()
        flushParagraph()
        elements.push(
          <h2 key={`h2-${index}`} className="font-editorial text-3xl md:text-4xl lg:text-6xl italic mb-6 md:mb-10 mt-8 md:mt-16 text-[#3D5A3D] leading-tight">
            {line.substring(2)}
          </h2>
        )
      } else if (line.startsWith('## ')) {
        flushList()
        flushParagraph()
        elements.push(
          <h3 key={`h3-${index}`} className="font-editorial text-2xl md:text-3xl lg:text-4xl italic mb-6 md:mb-8 mt-8 md:mt-12 text-[#3D5A3D] leading-tight">
            {line.substring(3)}
          </h3>
        )
      } else if (line.startsWith('- ')) {
        flushParagraph()
        currentList.push(line.substring(2).trim())
      } else if (line.trim() === '') {
        flushList()
        flushParagraph()
      } else {
        flushList()
        currentParagraph.push(line.trim())
      }
    })

    flushList()
    flushParagraph()
    return elements
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] text-[#3D5A3D] selection:bg-[#9D4A4A] selection:text-white font-sans overflow-x-hidden">
      {/* Structural Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <div className="h-full w-full grid grid-cols-12 max-w-7xl mx-auto border-x border-[#3D5A3D]">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="border-r border-[#3D5A3D] h-full" />
          ))}
        </div>
      </div>

      {/* Navigation Block */}
      <nav className="relative z-10 px-4 md:px-6 lg:px-12 py-4 md:py-8 border-b border-[#3D5A3D]/10 bg-[#F5F5DC]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <Link
              to="/blog"
              className="text-xs md:text-[10px] font-bold tracking-[0.3em] uppercase hover:text-[#9D4A4A] transition-colors duration-300 flex items-center gap-2 group min-h-[44px]"
            >
              <ArrowLeft size={16} className="md:w-3 md:h-3 group-hover:-translate-x-1 transition-transform" />
              Back to Journal
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-12 pb-1">
            {['About', 'Visit', 'Blog', 'Contact'].map((item) => {
              const isBlog = item === 'Blog'
              const isAbout = item === 'About'
              return (
                <Link
                  key={item}
                  to={isBlog ? '/blog' : isAbout ? '/about' : `/#${item.toLowerCase()}`}
                  className={`text-xs md:text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                    isBlog ? 'text-[#9D4A4A]' : 'text-[#666] hover:text-[#3D5A3D]'
                  }`}
                >
                  {item}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Header Block */}
        <header className="border-b border-[#3D5A3D]/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-8 p-4 md:p-8 lg:p-16 xl:p-24 border-r border-[#3D5A3D]/10">
              <AnimatedSection>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-6 md:mb-8">
                  <span className="text-xs md:text-[10px] font-black tracking-[0.2em] uppercase px-3 md:px-4 py-1.5 border border-[#3D5A3D] bg-[#3D5A3D] text-white">
                    {post.category}
                  </span>
                  <span className="text-xs md:text-[10px] font-bold text-[#999] tracking-widest uppercase">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h1 className="font-editorial text-3xl md:text-5xl lg:text-7xl xl:text-8xl italic leading-[0.95] text-[#3D5A3D] mb-6 md:mb-12 text-balance">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#9D4A4A] flex items-center justify-center text-white">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-xs md:text-[10px] font-bold uppercase tracking-widest text-[#999]">Written By</p>
                      <p className="text-sm md:text-base font-bold uppercase tracking-tight">{post.author}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
            
            <div className="lg:col-span-4 p-4 md:p-8 lg:p-12 bg-white/30 flex flex-col justify-between">
              <div className="hidden lg:block">
                <div className="w-24 h-24 lg:w-32 lg:h-32 border border-[#3D5A3D]/10 rounded-full flex items-center justify-center animate-spin-slow">
                  <Hash className="text-[#9D4A4A]" size={36} />
                </div>
              </div>
              <div className="space-y-6 md:space-y-8">
                <div className="pt-6 md:pt-8 border-t border-[#3D5A3D]/10">
                  <p className="text-xs md:text-[10px] font-bold uppercase tracking-widest text-[#999] mb-4 text-center lg:text-left">Share This Story</p>
                  <div className="flex justify-center lg:justify-start gap-3 md:gap-4">
                    {[1, 2, 3].map((i) => (
                      <button key={i} className="w-12 h-12 border border-[#3D5A3D]/10 rounded-full flex items-center justify-center hover:bg-[#3D5A3D] hover:text-white transition-all duration-500 group" aria-label={`Share option ${i}`}>
                        <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Image Block */}
        <section className="border-b border-[#3D5A3D]/10 bg-white">
          <div className="max-w-7xl mx-auto border-x border-[#3D5A3D]/10 overflow-hidden aspect-[16/9] md:aspect-[21/9]">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-all duration-1000"
            />
          </div>
        </section>

        {/* Content & Sidebar Grid */}
        <section>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
            {/* Main Content Block */}
            <div className="lg:col-span-8 p-4 md:p-8 lg:p-16 xl:p-24 border-r border-[#3D5A3D]/10 bg-white/50">
              <article className="max-w-3xl">
                <div className="text-xl md:text-2xl lg:text-3xl font-editorial italic leading-relaxed text-[#3D5A3D] mb-8 md:mb-16 border-l-4 border-[#9D4A4A] pl-4 md:pl-8 py-2 text-balance">
                  {post.excerpt}
                </div>
                <div className="prose-custom">
                  {renderContent(post.content)}
                </div>
              </article>
            </div>

            {/* Sidebar Block */}
            <div className="lg:col-span-4 bg-white/20">
              <div className="sticky top-24 md:top-32 p-4 md:p-8 lg:p-12 space-y-12 md:space-y-16">
                <div>
                  <p className="text-xs md:text-[10px] font-black tracking-[0.3em] uppercase text-[#9D4A4A] mb-6 md:mb-8 pb-4 border-b border-[#3D5A3D]/10">
                    Up Next
                  </p>
                  <div className="space-y-8 md:space-y-12">
                    {relatedPosts.map((rp) => (
                      <Link
                        key={rp.slug}
                        to="/blog/$slug"
                        params={{ slug: rp.slug }}
                        className="group block"
                      >
                        <div className="aspect-video overflow-hidden mb-3 md:mb-4 border border-[#3D5A3D]/5">
                          <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <p className="text-xs md:text-[9px] font-bold tracking-widest uppercase text-[#999] mb-2">{rp.category}</p>
                        <h4 className="font-editorial text-lg md:text-xl italic group-hover:text-[#9D4A4A] transition-colors text-balance">{rp.title}</h4>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="p-6 md:p-8 border border-[#3D5A3D]/10 bg-white/50">
                  <h4 className="font-editorial text-xl md:text-2xl italic mb-3 md:mb-4">Join our journal</h4>
                  <p className="text-xs md:text-sm text-[#666] leading-relaxed mb-4 md:mb-6 uppercase tracking-wider text-balance">Get fresh updates and vendor stories delivered to your inbox.</p>
                  <div className="flex flex-col gap-3 md:gap-2">
                    <input type="email" placeholder="EMAIL ADDRESS" className="bg-[#F5F5DC] border-b border-[#3D5A3D]/20 px-0 py-3 text-base md:text-sm font-bold focus:outline-none focus:border-[#9D4A4A] transition-colors min-h-[44px]" />
                    <button className="mt-4 bg-[#3D5A3D] text-white py-4 text-sm md:text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#9D4A4A] transition-all duration-300 min-h-[44px]">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Block */}
      <footer className="relative z-10 border-t border-[#3D5A3D] bg-[#3D5A3D] text-white py-12 md:py-20 px-4 md:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <div>
            <h4 className="font-editorial text-2xl md:text-3xl italic mb-2">Water Street Commons</h4>
            <p className="text-[#999] text-xs md:text-[10px] font-bold tracking-widest uppercase">
              © 2026 Downtown Bula Development Authority
            </p>
          </div>
          <Link
            to="/blog"
            className="px-6 py-3 md:px-8 md:py-4 border border-white/20 text-xs md:text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-[#3D5A3D] transition-all duration-500 min-h-[44px] flex items-center"
          >
            Back to Journal
          </Link>
        </div>
      </footer>

      <style>{`
        .font-editorial {
          font-family: 'Playfair Display', Georgia, serif;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  )
}
