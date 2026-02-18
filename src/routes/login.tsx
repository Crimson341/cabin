import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        navigate({ to: '/dashboard' })
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid password')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] text-[#3D5A3D] selection:bg-[#9D4A4A] selection:text-white font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border border-[#3D5A3D] bg-white">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-[#3D5A3D] text-center">
            <Link
              to="/"
              className="text-xs font-black tracking-[0.3em] uppercase hover:text-[#9D4A4A] transition-colors"
            >
              Water Street Commons
            </Link>
            <h1 className="font-editorial text-3xl md:text-4xl italic leading-tight mt-2">
              Dashboard Login
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 border border-[#3D5A3D] rounded-full flex items-center justify-center">
                <Lock size={24} className="text-[#9D4A4A]" />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-[#9D4A4A]/10 border border-[#9D4A4A]/20 flex items-center gap-3">
                <AlertCircle size={16} className="text-[#9D4A4A] shrink-0" />
                <p className="text-sm text-[#9D4A4A] font-bold tracking-wide uppercase">
                  {error}
                </p>
              </div>
            )}

            <label
              htmlFor="password"
              className="block text-xs font-black tracking-[0.2em] uppercase text-[#3D5A3D]/60 mb-3"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F5F5DC] border border-[#3D5A3D]/20 px-4 py-4 text-base font-medium focus:outline-none focus:border-[#9D4A4A] transition-colors min-h-[44px]"
              placeholder="Enter admin password"
              required
              autoFocus
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#3D5A3D] text-white py-4 text-xs font-black tracking-[0.2em] uppercase hover:bg-[#9D4A4A] transition-all duration-300 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="p-6 md:p-8 border-t border-[#3D5A3D]/10 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] uppercase text-[#3D5A3D]/40 hover:text-[#9D4A4A] transition-colors min-h-[44px]"
            >
              <ArrowLeft size={14} />
              Back to site
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .font-editorial {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>
    </div>
  )
}
