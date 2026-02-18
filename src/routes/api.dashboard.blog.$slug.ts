import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { z } from 'zod'
import { getClient } from '../db'
import { requireAuth } from '../auth'

const BlogPostUpdateSchema = z.object({
  title: z.string().min(1).max(255),
  excerpt: z.string().max(1000).optional().nullable(),
  content: z.string().min(1),
  author: z.string().max(255).optional().nullable(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  image: z
    .string()
    .url()
    .refine((url) => url.startsWith('https://'), 'Image URL must use HTTPS')
    .max(500)
    .optional()
    .nullable(),
  category: z.string().max(100).optional().nullable(),
  published: z.boolean().optional(),
})

export const Route = createFileRoute('/api/dashboard/blog/$slug')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const authError = await requireAuth(request)
        if (authError) return authError

        try {
          const client = getClient()
          if (!client) {
            return json({ error: 'Database not configured' }, { status: 500 })
          }

          const rows = await client`
            SELECT id, slug, title, excerpt, content, author, category, date, image, published, created_at, updated_at
            FROM blog_posts
            WHERE slug = ${params.slug}
            LIMIT 1
          `
          const post = Array.isArray(rows) ? rows[0] : null
          if (!post) {
            return json({ error: 'Post not found' }, { status: 404 })
          }
          return json({ post })
        } catch (error) {
          console.error('Blog get error:', error)
          return json(
            { error: 'Failed to fetch blog post' },
            { status: 500 }
          )
        }
      },

      PUT: async ({ request, params }) => {
        const authError = await requireAuth(request)
        if (authError) return authError

        try {
          const client = getClient()
          if (!client) {
            return json({ error: 'Database not configured' }, { status: 500 })
          }

          const body = await request.json()
          const parsed = BlogPostUpdateSchema.safeParse(body)

          if (!parsed.success) {
            return json(
              { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
              { status: 400 }
            )
          }

          const { title, excerpt, content, author, date, image, category, published } =
            parsed.data

          // Slug is immutable after creation to preserve URLs
          const rows = await client`
            UPDATE blog_posts
            SET title = ${title},
                excerpt = ${excerpt ?? null},
                content = ${content},
                author = ${author ?? null},
                date = ${date ?? null},
                image = ${image ?? null},
                category = ${category ?? null},
                published = ${published !== false},
                updated_at = NOW()
            WHERE slug = ${params.slug}
            RETURNING id, slug, title, excerpt, author, category, date, image, published, created_at, updated_at
          `

          const post = Array.isArray(rows) ? rows[0] : null
          if (!post) {
            return json({ error: 'Post not found' }, { status: 404 })
          }
          return json({ post })
        } catch (error) {
          console.error('Blog update error:', error)
          return json(
            { error: 'Failed to update blog post' },
            { status: 500 }
          )
        }
      },

      DELETE: async ({ request, params }) => {
        const authError = await requireAuth(request)
        if (authError) return authError

        try {
          const client = getClient()
          if (!client) {
            return json({ error: 'Database not configured' }, { status: 500 })
          }

          const rows =
            await client`DELETE FROM blog_posts WHERE slug = ${params.slug} RETURNING id`
          const deleted = Array.isArray(rows) ? rows[0] : null
          if (!deleted) {
            return json({ error: 'Post not found' }, { status: 404 })
          }
          return json({ success: true })
        } catch (error) {
          console.error('Blog delete error:', error)
          return json(
            { error: 'Failed to delete blog post' },
            { status: 500 }
          )
        }
      },
    },
  },
})
