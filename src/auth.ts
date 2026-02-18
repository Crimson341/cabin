import { json } from '@tanstack/react-start'

export const COOKIE_NAME = 'session'
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not set')
  return secret
}

async function hmacSign(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  )
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

async function hmacVerify(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const expected = await hmacSign(payload, secret)
  return expected === signature
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret()
  const payload = JSON.stringify({ exp: Date.now() + TOKEN_EXPIRY_MS })
  const signature = await hmacSign(payload, secret)
  const token = btoa(payload) + '.' + signature
  return token
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const secret = getSecret()
    const [payloadB64, signature] = token.split('.')
    if (!payloadB64 || !signature) return false

    const payload = atob(payloadB64)
    const valid = await hmacVerify(payload, signature, secret)
    if (!valid) return false

    const { exp } = JSON.parse(payload)
    if (typeof exp !== 'number' || Date.now() > exp) return false

    return true
  } catch {
    return false
  }
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {}
  for (const pair of cookieHeader.split(';')) {
    const [name, ...rest] = pair.trim().split('=')
    if (name) cookies[name] = decodeURIComponent(rest.join('='))
  }
  return cookies
}

export function getSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = parseCookies(cookieHeader)
  return cookies[COOKIE_NAME] || null
}

export async function requireAuth(request: Request): Promise<Response | null> {
  const token = getSessionToken(request)

  if (!token || !(await verifySessionToken(token))) {
    return json({ error: 'Unauthorized' }, { status: 401 }) as Response
  }

  return null // authenticated
}

// Use Secure flag in production; omit in development so HTTP localhost works
const secureCookieFlag = process.env.NODE_ENV === 'production' ? '; Secure' : ''

export function buildSessionCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Strict${secureCookieFlag}; Max-Age=86400`
}

export function buildClearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Strict${secureCookieFlag}; Max-Age=0`
}
