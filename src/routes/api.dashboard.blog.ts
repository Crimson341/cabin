import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { getClient } from '../db'
import { requireAuth } from '../auth'

export const Route = createFileRoute('/api/dashboard/blog')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const authError = await requireAuth(request)
        if (authError) return authError

        try {
          const client = getClient()
          if (!client) {
            return json({ error: 'Database not configured' }, { status: 500 })
          }

          const url = new URL(request.url)
          const limit = Math.min(Number(url.searchParams.get('limit') ?? 100), 200)
          const offset = Math.max(Number(url.searchParams.get('offset') ?? 0), 0)

          const rows = await client`
            SELECT id, slug, title, excerpt, content, author, category, date, image, published, created_at, updated_at
            FROM blog_posts
            ORDER BY date DESC
            LIMIT ${limit} OFFSET ${offset}
          `
          return json({ posts: Array.isArray(rows) ? rows : [] })
        } catch (error) {
          console.error('Dashboard blog list error:', error)
          return json(
            { error: 'Failed to fetch blog posts' },
            { status: 500 }
          )
        }
      },
    },
  },
})
