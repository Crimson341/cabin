import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { getClient } from '../db'

export const Route = createFileRoute('/api/blog')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const client = getClient()
          if (!client) {
            return json({ error: 'Database not configured' }, { status: 500 })
          }

          const url = new URL(request.url)
          const slug = url.searchParams.get('slug')

          if (slug) {
            const rows = await client`
              SELECT id, slug, title, excerpt, content, author, category, date, image, published, created_at, updated_at
              FROM blog_posts
              WHERE slug = ${slug} AND published = true
              LIMIT 1
            `
            const post = Array.isArray(rows) ? rows[0] : null
            if (!post) {
              return json({ error: 'Post not found' }, { status: 404 })
            }
            return json({ post })
          }

          // List: omit content to avoid fetching large text for every post
          const rows = await client`
            SELECT slug, title, excerpt, category, date, image, author, published
            FROM blog_posts
            WHERE published = true
            ORDER BY date DESC
          `
          return json({ posts: Array.isArray(rows) ? rows : [] })
        } catch (error) {
          console.error('Blog API error:', error)
          return json({ error: 'Failed to fetch blog posts' }, { status: 500 })
        }
      },
    },
  },
})
