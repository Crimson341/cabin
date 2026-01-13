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
        <strong key={key++} className="font-bold text-[#1a1a1a]">
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
          <p key={`p-${elements.length}`} className="text-[#666] leading-relaxed mb-8 text-xl font-light">
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
              <li key={i} className="flex items-start gap-4 text-[#666] text-lg font-light">
                <span className="mt-2 w-1.5 h-1.5 bg-[#E07B5B] rounded-full shrink-0" />
                <span>{renderText(item)}</span>
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
          <h2 key={`h2-${index}`} className="font-editorial text-4xl md:text-6xl italic mb-10 mt-16 text-[#1a1a1a] leading-tight">
            {line.substring(2)}
          </h2>
        )
      } else if (line.startsWith('## ')) {
        flushList()
        flushParagraph()
        elements.push(
          <h3 key={`h3-${index}`} className="font-editorial text-3xl md:text-4xl italic mb-8 mt-12 text-[#1a1a1a] leading-tight">
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
    <div className="min-h-screen bg-[#F5F3EF] text-[#1a1a1a] selection:bg-[#E07B5B] selection:text-white font-sans overflow-x-hidden">
      {/* Structural Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <div className="h-full w-full grid grid-cols-12 max-w-7xl mx-auto border-x border-[#1a1a1a]">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="border-r border-[#1a1a1a] h-full" />
          ))}
        </div>
      </div>

      {/* Navigation Block */}
      <nav className="relative z-10 px-6 md:px-12 py-8 border-b border-[#1a1a1a]/10 bg-[#F5F3EF]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <Link
              to="/blog"
              className="text-[10px] font-bold tracking-[0.3em] uppercase hover:text-[#E07B5B] transition-colors duration-300 flex items-center gap-2 group"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
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
                  className={`text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                    isBlog ? 'text-[#E07B5B]' : 'text-[#666] hover:text-[#1a1a1a]'
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
        <header className="border-b border-[#1a1a1a]/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-8 p-8 md:p-16 lg:p-24 border-r border-[#1a1a1a]/10">
              <AnimatedSection>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 border border-[#1a1a1a] bg-[#1a1a1a] text-white">
                    {post.category}
                  </span>
                  <span className="text-[10px] font-bold text-[#999] tracking-widest uppercase">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h1 className="font-editorial text-5xl md:text-7xl lg:text-8xl italic leading-[0.95] text-[#1a1a1a] mb-12">
                  {post.title}
                </h1>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E07B5B] flex items-center justify-center text-white">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#999]">Written By</p>
                      <p className="text-sm font-bold uppercase tracking-tight">{post.author}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
            
            <div className="lg:col-span-4 p-8 md:p-12 bg-white/30 flex flex-col justify-between">
              <div className="hidden lg:block">
                <div className="w-32 h-32 border border-[#1a1a1a]/10 rounded-full flex items-center justify-center animate-spin-slow">
                  <Hash className="text-[#E07B5B]" size={48} />
                </div>
              </div>
              <div className="space-y-8">
                <div className="pt-8 border-t border-[#1a1a1a]/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-4 text-center lg:text-left">Share This Story</p>
                  <div className="flex justify-center lg:justify-start gap-4">
                    {[1, 2, 3].map((i) => (
                      <button key={i} className="w-12 h-12 border border-[#1a1a1a]/10 rounded-full flex items-center justify-center hover:bg-[#1a1a1a] hover:text-white transition-all duration-500 group">
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
        <section className="border-b border-[#1a1a1a]/10 bg-white">
          <div className="max-w-7xl mx-auto border-x border-[#1a1a1a]/10 overflow-hidden aspect-[21/9]">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
            />
          </div>
        </section>

        {/* Content & Sidebar Grid */}
        <section>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
            {/* Main Content Block */}
            <div className="lg:col-span-8 p-8 md:p-16 lg:p-24 border-r border-[#1a1a1a]/10 bg-white/50">
              <article className="max-w-3xl">
                <div className="text-2xl md:text-3xl font-editorial italic leading-relaxed text-[#1a1a1a] mb-16 border-l-4 border-[#E07B5B] pl-8 py-2">
                  {post.excerpt}
                </div>
                <div className="prose-custom">
                  {renderContent(post.content)}
                </div>
              </article>
            </div>

            {/* Sidebar Block */}
            <div className="lg:col-span-4 bg-white/20">
              <div className="sticky top-32 p-8 md:p-12 space-y-16">
                <div>
                  <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#E07B5B] mb-8 pb-4 border-b border-[#1a1a1a]/10">
                    Up Next
                  </p>
                  <div className="space-y-12">
                    {relatedPosts.map((rp) => (
                      <Link
                        key={rp.slug}
                        to="/blog/$slug"
                        params={{ slug: rp.slug }}
                        className="group block"
                      >
                        <div className="aspect-video overflow-hidden mb-4 border border-[#1a1a1a]/5">
                          <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <p className="text-[9px] font-bold tracking-widest uppercase text-[#999] mb-2">{rp.category}</p>
                        <h4 className="font-editorial text-xl italic group-hover:text-[#E07B5B] transition-colors">{rp.title}</h4>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="p-8 border border-[#1a1a1a]/10 bg-white/50">
                  <h4 className="font-editorial text-2xl italic mb-4">Join our journal</h4>
                  <p className="text-xs text-[#666] leading-relaxed mb-6 uppercase tracking-wider">Get fresh updates and vendor stories delivered to your inbox.</p>
                  <div className="flex flex-col gap-2">
                    <input type="email" placeholder="EMAIL ADDRESS" className="bg-[#F5F3EF] border-b border-[#1a1a1a]/20 px-0 py-3 text-[10px] font-bold focus:outline-none focus:border-[#E07B5B] transition-colors" />
                    <button className="mt-4 bg-[#1a1a1a] text-white py-4 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#E07B5B] transition-all duration-300">
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
      <footer className="relative z-10 border-t border-[#1a1a1a] bg-[#1a1a1a] text-white py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h4 className="font-editorial text-3xl italic mb-2">Water Street Commons</h4>
            <p className="text-[#999] text-[10px] font-bold tracking-widest uppercase">
              © 2026 Downtown Alpena Development Authority
            </p>
          </div>
          <Link
            to="/blog"
            className="px-8 py-4 border border-white/20 text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-[#1a1a1a] transition-all duration-500"
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
