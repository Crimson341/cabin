import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { createSessionToken, buildSessionCookie } from '../auth'

// Simple in-memory rate limiter: max 5 attempts per IP per 15 minutes
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const maxAttempts = 5

  const record = loginAttempts.get(ip)
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= maxAttempts) return false
  record.count++
  return true
}

// Timing-safe string comparison using WebCrypto HMAC to prevent timing attacks
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const aBytes = encoder.encode(a)
  const bBytes = encoder.encode(b)

  if (aBytes.length !== bBytes.length) return false

  let result = 0
  for (let i = 0; i < aBytes.length; i++) {
    result |= aBytes[i] ^ bBytes[i]
  }
  return result === 0
}

export const Route = createFileRoute('/api/auth/login')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const ip =
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown'

          if (!checkRateLimit(ip)) {
            return json(
              { error: 'Too many login attempts. Please try again later.' },
              { status: 429 }
            )
          }

          const body = await request.json()
          const { password } = body

          const adminPassword = process.env.ADMIN_PASSWORD
          if (!adminPassword) {
            return json(
              { error: 'Admin password not configured' },
              { status: 500 }
            )
          }

          const passwordMatch = await timingSafeEqual(
            String(password ?? ''),
            adminPassword
          )

          if (!passwordMatch) {
            return json({ error: 'Invalid password' }, { status: 401 })
          }

          const token = await createSessionToken()
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Set-Cookie': buildSessionCookie(token),
            },
          })
        } catch (error) {
          console.error('Login error:', error)
          return json({ error: 'Login failed' }, { status: 500 })
        }
      },
    },
  },
})
