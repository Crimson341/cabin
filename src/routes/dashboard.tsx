import { createFileRoute, isRedirect, Link, redirect, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Users,
  Calendar,
  TrendingUp,
  BarChart3,
  Inbox,
  ArrowLeft,
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  LogOut,
} from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    try {
      const res = await fetch('/api/auth/check')
      const data = await res.json()
      if (!data.authenticated) {
        throw redirect({ to: '/login' })
      }
    } catch (e) {
      if (isRedirect(e)) throw e
      throw redirect({ to: '/login' })
    }
  },
  component: Dashboard,
})

type BlogPost = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  content: string
  author: string | null
  date: string | null
  image: string | null
  category: string | null
  published: boolean
  created_at: string
  updated_at: string
}

function formatRelativeDate(dateStr: string): string {
  // Parse date-only strings (YYYY-MM-DD) as local midnight to avoid UTC offset shifts
  const date = dateStr.includes('T') ? new Date(dateStr) : new Date(dateStr + 'T00:00:00')
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function truncateMessage(message: string, maxLen = 60): string {
  if (message.length <= maxLen) return message
  return message.slice(0, maxLen).trimEnd() + '...'
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[#3D5A3D]/10 rounded ${className}`}
    />
  )
}

function makeEmptyForm() {
  return {
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: '',
    image: '',
    category: '',
    published: true,
  }
}

function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [blogView, setBlogView] = useState<'list' | 'form'>('list')
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [formData, setFormData] = useState(makeEmptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formError, setFormError] = useState('')

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetch('/api/dashboard/stats').then((r) => r.json()),
    staleTime: 30_000,
  })

  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    error: submissionsError,
  } = useQuery({
    queryKey: ['dashboard-submissions'],
    queryFn: () =>
      fetch('/api/dashboard/submissions').then((r) => r.json()),
    staleTime: 30_000,
  })

  const { data: blogData, isLoading: blogLoading } = useQuery({
    queryKey: ['dashboard-blog'],
    queryFn: () => fetch('/api/dashboard/blog').then((r) => r.json()),
    staleTime: 30_000,
  })

  const submissions = submissionsData?.submissions ?? []
  const blogPosts: BlogPost[] = blogData?.posts ?? []

  const topInterest =
    stats?.byInterest?.length > 0
      ? stats.byInterest.reduce(
          (
            max: { interest: string; count: number },
            item: { interest: string; count: number }
          ) => (item.count > max.count ? item : max),
          stats.byInterest[0]
        )
      : null

  const statCards = [
    { label: 'Total Submissions', value: stats?.total ?? 0, icon: Users },
    { label: 'This Month', value: stats?.thisMonth ?? 0, icon: Calendar },
    { label: 'This Week', value: stats?.thisWeek ?? 0, icon: TrendingUp },
    { label: 'Top Interest', value: topInterest?.interest ?? '—', icon: BarChart3 },
  ]

  const createMutation = useMutation({
    mutationFn: (data: ReturnType<typeof makeEmptyForm>) =>
      fetch('/api/dashboard/blog/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json().then((d) => ({ ok: r.ok, data: d }))),
    onSuccess: ({ ok, data }) => {
      if (ok) {
        queryClient.invalidateQueries({ queryKey: ['dashboard-blog'] })
        setBlogView('list')
        setFormData(makeEmptyForm())
        setFormError('')
      } else {
        setFormError(data.error || 'Failed to create post')
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: ReturnType<typeof makeEmptyForm> }) =>
      fetch(`/api/dashboard/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json().then((d) => ({ ok: r.ok, data: d }))),
    onSuccess: ({ ok, data }) => {
      if (ok) {
        queryClient.invalidateQueries({ queryKey: ['dashboard-blog'] })
        setBlogView('list')
        setEditingSlug(null)
        setFormData(makeEmptyForm())
        setFormError('')
      } else {
        setFormError(data.error || 'Failed to update post')
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (slug: string) =>
      fetch(`/api/dashboard/blog/${slug}`, { method: 'DELETE' }).then((r) =>
        r.json()
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-blog'] })
      setDeleteConfirm(null)
    },
  })

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    navigate({ to: '/login' })
  }

  const openNewPost = () => {
    setEditingSlug(null)
    setFormData(makeEmptyForm())
    setFormError('')
    setBlogView('form')
  }

  const openEditPost = (post: BlogPost) => {
    setEditingSlug(post.slug)
    setFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      author: post.author || '',
      date: post.date ? post.date.split('T')[0] : '',
      image: post.image || '',
      category: post.category || '',
      published: post.published,
    })
    setFormError('')
    setBlogView('form')
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    const data = {
      ...formData,
      slug: formData.slug || slugify(formData.title),
    }

    if (!data.title || !data.content) {
      setFormError('Title and content are required')
      return
    }

    if (editingSlug) {
      updateMutation.mutate({ slug: editingSlug, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const formSaving = createMutation.isPending || updateMutation.isPending

  return (
    <div className="min-h-screen bg-[#F5F5DC] text-[#3D5A3D] selection:bg-[#9D4A4A] selection:text-white font-sans">
      <div className="max-w-[1600px] mx-auto border-x border-[#3D5A3D]">
        {/* HEADER */}
        <header className="border-b border-[#3D5A3D] bg-white p-4 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="w-10 h-10 border border-[#3D5A3D] rounded-full flex items-center justify-center hover:bg-[#3D5A3D] hover:text-white transition-all duration-300 min-h-[44px] min-w-[44px]"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <Link
                to="/"
                className="text-xs font-black tracking-[0.3em] uppercase hover:text-[#9D4A4A] transition-colors"
              >
                Water Street Commons
              </Link>
              <h1 className="font-editorial text-2xl md:text-3xl italic leading-tight -mt-0.5">
                Dashboard
              </h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] uppercase text-[#3D5A3D]/60 hover:text-[#9D4A4A] transition-colors min-h-[44px]"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </header>

        {/* STATS CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border-b border-[#3D5A3D]">
          {statCards.map((card, i) => (
            <div
              key={card.label}
              className={`p-6 md:p-8 bg-white ${i < statCards.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-[#3D5A3D]' : ''} ${i === 1 ? 'sm:border-r-0 md:border-r' : ''}`}
            >
              {statsLoading ? (
                <div className="space-y-3">
                  <SkeletonBlock className="w-8 h-8 rounded-full" />
                  <SkeletonBlock className="w-20 h-8" />
                  <SkeletonBlock className="w-28 h-4" />
                </div>
              ) : (
                <>
                  <card.icon size={24} className="text-[#9D4A4A] mb-4" />
                  <p className="font-editorial text-3xl md:text-4xl italic leading-none mb-2">
                    {card.value}
                  </p>
                  <p className="text-xs font-black tracking-[0.2em] uppercase text-[#3D5A3D]/60">
                    {card.label}
                  </p>
                </>
              )}
            </div>
          ))}
        </section>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#3D5A3D]">
          {/* SUBMISSIONS TABLE */}
          <div className="md:col-span-8 border-b md:border-b-0 md:border-r border-[#3D5A3D] bg-white">
            <div className="p-6 md:p-8 border-b border-[#3D5A3D]/10">
              <p className="text-xs font-black tracking-[0.3em] uppercase text-[#3D5A3D]/60">
                Recent Submissions
              </p>
            </div>

            {submissionsLoading ? (
              <div className="divide-y divide-[#3D5A3D]/10">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="p-6 md:p-8 space-y-3">
                    <div className="flex gap-4">
                      <SkeletonBlock className="w-32 h-5" />
                      <SkeletonBlock className="w-48 h-5" />
                    </div>
                    <SkeletonBlock className="w-full h-4" />
                  </div>
                ))}
              </div>
            ) : submissionsError ? (
              <div className="p-12 md:p-24 text-center">
                <p className="text-sm text-[#9D4A4A] font-bold tracking-widest uppercase">
                  Failed to load submissions
                </p>
                <p className="text-sm text-[#3D5A3D]/40 mt-2">
                  Please try refreshing the page.
                </p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-12 md:p-24 text-center">
                <Inbox size={48} className="mx-auto text-[#3D5A3D]/20 mb-6" />
                <p className="font-editorial text-2xl italic mb-2">
                  No submissions yet
                </p>
                <p className="text-sm text-[#3D5A3D]/40 font-bold tracking-widest uppercase">
                  Contact form submissions will appear here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#3D5A3D]/10">
                      <th className="p-4 md:px-8 md:py-4 text-xs font-black tracking-[0.2em] uppercase text-[#3D5A3D]/40">
                        Name
                      </th>
                      <th className="p-4 md:px-8 md:py-4 text-xs font-black tracking-[0.2em] uppercase text-[#3D5A3D]/40 hidden sm:table-cell">
                        Email
                      </th>
                      <th className="p-4 md:px-8 md:py-4 text-xs font-black tracking-[0.2em] uppercase text-[#3D5A3D]/40">
                        Interest
                      </th>
                      <th className="p-4 md:px-8 md:py-4 text-xs font-black tracking-[0.2em] uppercase text-[#3D5A3D]/40 hidden md:table-cell">
                        Message
                      </th>
                      <th className="p-4 md:px-8 md:py-4 text-xs font-black tracking-[0.2em] uppercase text-[#3D5A3D]/40 text-right">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3D5A3D]/10">
                    {submissions.map(
                      (sub: {
                        id: string | number
                        name: string
                        email: string
                        interest: string
                        message: string
                        created_at: string
                      }) => (
                        <tr
                          key={sub.id}
                          className="hover:bg-[#F5F5DC]/50 transition-colors"
                        >
                          <td className="p-4 md:px-8 md:py-5 text-sm font-semibold">
                            {sub.name}
                          </td>
                          <td className="p-4 md:px-8 md:py-5 text-sm text-[#3D5A3D]/60 hidden sm:table-cell">
                            {sub.email}
                          </td>
                          <td className="p-4 md:px-8 md:py-5">
                            <span className="inline-block text-xs font-black tracking-[0.15em] uppercase bg-[#3D5A3D]/5 border border-[#3D5A3D]/10 px-3 py-1 rounded-full">
                              {sub.interest}
                            </span>
                          </td>
                          <td className="p-4 md:px-8 md:py-5 text-sm text-[#3D5A3D]/50 hidden md:table-cell max-w-[240px]">
                            {truncateMessage(sub.message)}
                          </td>
                          <td className="p-4 md:px-8 md:py-5 text-sm text-[#3D5A3D]/40 text-right whitespace-nowrap">
                            {formatRelativeDate(sub.created_at)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* BLOG MANAGEMENT SIDEBAR */}
          <div className="md:col-span-4 bg-[#F5F5DC]">
            <div className="p-6 md:p-8 border-b border-[#3D5A3D]/10 flex items-center justify-between">
              <p className="text-xs font-black tracking-[0.3em] uppercase text-[#3D5A3D]/60">
                Blog Posts
              </p>
              {blogView === 'list' ? (
                <button
                  onClick={openNewPost}
                  className="inline-flex items-center gap-1.5 text-xs font-black tracking-[0.15em] uppercase text-[#9D4A4A] hover:text-[#3D5A3D] transition-colors min-h-[44px]"
                >
                  <Plus size={14} />
                  New Post
                </button>
              ) : (
                <button
                  onClick={() => {
                    setBlogView('list')
                    setEditingSlug(null)
                    setFormData(makeEmptyForm())
                    setFormError('')
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-black tracking-[0.15em] uppercase text-[#3D5A3D]/60 hover:text-[#9D4A4A] transition-colors min-h-[44px]"
                >
                  <X size={14} />
                  Cancel
                </button>
              )}
            </div>

            {blogView === 'list' ? (
              <>
                {blogLoading ? (
                  <div className="divide-y divide-[#3D5A3D]/10">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="p-6 md:p-8 space-y-3">
                        <SkeletonBlock className="w-20 h-4" />
                        <SkeletonBlock className="w-full h-5" />
                        <SkeletonBlock className="w-24 h-3" />
                      </div>
                    ))}
                  </div>
                ) : blogPosts.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileText
                      size={36}
                      className="mx-auto text-[#3D5A3D]/20 mb-4"
                    />
                    <p className="font-editorial text-lg italic mb-2">
                      No posts yet
                    </p>
                    <p className="text-xs text-[#3D5A3D]/40 font-bold tracking-widest uppercase">
                      Create your first blog post
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#3D5A3D]/10">
                    {blogPosts.map((post) => (
                      <div
                        key={post.slug}
                        className="p-6 md:p-8 hover:bg-white/60 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-block text-[10px] font-black tracking-[0.15em] uppercase bg-[#9D4A4A]/10 text-[#9D4A4A] px-2.5 py-1 rounded-full">
                              {post.category || 'Uncategorized'}
                            </span>
                            {!post.published && (
                              <span className="inline-block text-[10px] font-black tracking-[0.15em] uppercase bg-[#3D5A3D]/10 text-[#3D5A3D]/60 px-2.5 py-1 rounded-full">
                                Draft
                              </span>
                            )}
                          </div>
                        </div>
                        <h3 className="font-editorial text-lg italic leading-snug mb-2">
                          {post.title}
                        </h3>
                        <p className="text-xs font-bold tracking-[0.15em] uppercase text-[#3D5A3D]/40 mb-4">
                          {post.date
                            ? formatRelativeDate(post.date)
                            : 'No date'}
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEditPost(post)}
                            className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.15em] uppercase text-[#3D5A3D]/60 hover:text-[#9D4A4A] transition-colors min-h-[44px]"
                          >
                            <Pencil size={12} />
                            Edit
                          </button>
                          <Link
                            to="/blog/$slug"
                            params={{ slug: post.slug }}
                            className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.15em] uppercase text-[#3D5A3D]/60 hover:text-[#9D4A4A] transition-colors min-h-[44px]"
                          >
                            <Eye size={12} />
                            View
                          </Link>
                          {deleteConfirm === post.slug ? (
                            <div className="flex items-center gap-2 ml-auto">
                              <span className="text-[10px] font-black tracking-[0.1em] uppercase text-[#9D4A4A]">
                                Delete?
                              </span>
                              <button
                                onClick={() =>
                                  deleteMutation.mutate(post.slug)
                                }
                                className="text-[10px] font-black tracking-[0.1em] uppercase text-white bg-[#9D4A4A] px-2.5 py-1 hover:bg-[#3D5A3D] transition-colors min-h-[44px]"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="text-[10px] font-black tracking-[0.1em] uppercase text-[#3D5A3D]/60 hover:text-[#3D5A3D] transition-colors min-h-[44px]"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(post.slug)}
                              className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.15em] uppercase text-[#3D5A3D]/60 hover:text-[#9D4A4A] transition-colors ml-auto min-h-[44px]"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-6 md:p-8 border-t border-[#3D5A3D]/10">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] uppercase hover:text-[#9D4A4A] transition-colors min-h-[44px]"
                  >
                    <FileText size={14} />
                    View public blog
                  </Link>
                </div>
              </>
            ) : (
              /* BLOG POST FORM */
              <form
                onSubmit={handleFormSubmit}
                className="p-6 md:p-8 space-y-5"
              >
                <h3 className="font-editorial text-xl italic mb-4">
                  {editingSlug ? 'Edit Post' : 'New Post'}
                </h3>

                {formError && (
                  <div className="p-3 bg-[#9D4A4A]/10 border border-[#9D4A4A]/20 text-sm text-[#9D4A4A] font-bold tracking-wide uppercase">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#3D5A3D]/60 mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value
                      setFormData((f) => ({
                        ...f,
                        title,
                        slug: editingSlug ? f.slug : slugify(title),
                      }))
                    }}
                    className="w-full bg-white border border-[#3D5A3D]/20 px-3 py-2.5 text-sm focus:outline-none focus:border-[#9D4A4A] transition-colors min-h-[44px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#3D5A3D]/60 mb-1.5">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, slug: e.target.value }))
                    }
                    className="w-full bg-white border border-[#3D5A3D]/20 px-3 py-2.5 text-sm focus:outline-none focus:border-[#9D4A4A] transition-colors min-h-[44px] text-[#3D5A3D]/60"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#3D5A3D]/60 mb-1.5">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, excerpt: e.target.value }))
                    }
                    rows={2}
                    className="w-full bg-white border border-[#3D5A3D]/20 px-3 py-2.5 text-sm focus:outline-none focus:border-[#9D4A4A] transition-colors resize-y"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#3D5A3D]/60 mb-1.5">
                    Content * (Markdown)
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, content: e.target.value }))
                    }
                    rows={10}
                    className="w-full bg-white border border-[#3D5A3D]/20 px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#9D4A4A] transition-colors resize-y"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#3D5A3D]/60 mb-1.5">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, author: e.target.value }))
                      }
                      className="w-full bg-white border border-[#3D5A3D]/20 px-3 py-2.5 text-sm focus:outline-none focus:border-[#9D4A4A] transition-colors min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#3D5A3D]/60 mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, date: e.target.value }))
                      }
                      className="w-full bg-white border border-[#3D5A3D]/20 px-3 py-2.5 text-sm focus:outline-none focus:border-[#9D4A4A] transition-colors min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#3D5A3D]/60 mb-1.5">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, image: e.target.value }))
                    }
                    className="w-full bg-white border border-[#3D5A3D]/20 px-3 py-2.5 text-sm focus:outline-none focus:border-[#9D4A4A] transition-colors min-h-[44px]"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#3D5A3D]/60 mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, category: e.target.value }))
                    }
                    className="w-full bg-white border border-[#3D5A3D]/20 px-3 py-2.5 text-sm focus:outline-none focus:border-[#9D4A4A] transition-colors min-h-[44px]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((f) => ({ ...f, published: !f.published }))
                    }
                    className={`inline-flex items-center gap-2 text-xs font-black tracking-[0.15em] uppercase transition-colors min-h-[44px] ${
                      formData.published
                        ? 'text-[#3D5A3D]'
                        : 'text-[#3D5A3D]/40'
                    }`}
                  >
                    {formData.published ? (
                      <Eye size={14} />
                    ) : (
                      <EyeOff size={14} />
                    )}
                    {formData.published ? 'Published' : 'Draft'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={formSaving}
                  className="w-full bg-[#3D5A3D] text-white py-3 text-xs font-black tracking-[0.2em] uppercase hover:bg-[#9D4A4A] transition-all duration-300 min-h-[44px] disabled:opacity-50"
                >
                  {formSaving
                    ? 'Saving...'
                    : editingSlug
                      ? 'Update Post'
                      : 'Create Post'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="border-b border-[#3D5A3D] bg-[#3D5A3D] p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-xs font-black tracking-[0.3em] uppercase hover:text-[#9D4A4A] transition-colors min-h-[44px]"
          >
            <ArrowLeft size={14} />
            Back to site
          </Link>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/30">
            &copy; 2026 Water Street Commons
          </p>
        </footer>
      </div>

      <style>{`
        .font-editorial {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>
    </div>
  )
}
