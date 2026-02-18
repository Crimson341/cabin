export const SEO_SITE_NAME = 'Water Street Commons'

// Prefer setting this in `.env` as VITE_SITE_ORIGIN=https://example.com
export const SEO_SITE_ORIGIN =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined) || 'https://waterstreetcommons.com'

export const SEO_DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop'

export const SEO_DEFAULT_DESCRIPTION =
  'A colorful riverside nook in Downtown Bula. Five tiny shops for local makers to grow, share, and sparkle.'

export const SEO_TITLE_TEMPLATE = (pageTitle: string) => `${pageTitle} | ${SEO_SITE_NAME}`

export function seoTruncateDescription(text: string, maxLen = 160): string {
  const trimmed = text.trim()
  if (trimmed.length <= maxLen) return trimmed
  // Try to cut on word boundary.
  const slice = trimmed.slice(0, maxLen - 1)
  const lastSpace = slice.lastIndexOf(' ')
  return (lastSpace > 60 ? slice.slice(0, lastSpace) : slice).trimEnd() + '…'
}

export function seoAbsoluteUrl(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${SEO_SITE_ORIGIN}${path}`
}

export function seoCanonicalPath(pathname: string): string {
  // Policy: no trailing slash except for root.
  if (pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

export type OrganizationJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'Organization' | 'LocalBusiness'
  name: string
  url: string
  logo?: string
  image?: string
  sameAs?: string[]
  address?: {
    '@type': 'PostalAddress'
    addressLocality: string
    addressRegion: string
    addressCountry: string
  }
}

export function buildOrganizationJsonLd(): OrganizationJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SEO_SITE_NAME,
    url: SEO_SITE_ORIGIN,
    logo: SEO_DEFAULT_OG_IMAGE,
    image: SEO_DEFAULT_OG_IMAGE,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bula',
      addressRegion: 'MI',
      addressCountry: 'US',
    },
    // Fill these in when you have real profiles.
    sameAs: [],
  }
}

export function JsonLd({ data }: { data: object }) {
  // Escape </script> to prevent breaking out of the script tag
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
