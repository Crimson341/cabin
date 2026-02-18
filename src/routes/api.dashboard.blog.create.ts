import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { z } from 'zod'
import { getClient } from '../db'
import { requireAuth } from '../auth'

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const BlogPostCreateSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(SLUG_RE, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1).max(255),
  excerpt: z.string().max(1000).optional(),
  content: z.string().min(1),
  author: z.string().max(255).optional(),
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

export const Route = createFileRoute('/api/dashboard/blog/create')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authError = await requireAuth(request)
        if (authError) return authError

        try {
          const client = getClient()
          if (!client) {
            return json({ error: 'Database not configured' }, { status: 500 })
          }

          const body = await request.json()
          const parsed = BlogPostCreateSchema.safeParse(body)

          if (!parsed.success) {
            return json(
              { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
              { status: 400 }
            )
          }

          const { slug, title, excerpt, content, author, date, image, category, published } =
            parsed.data

          const rows = await client`
            INSERT INTO blog_posts (slug, title, excerpt, content, author, date, image, category, published)
            VALUES (${slug}, ${title}, ${excerpt ?? null}, ${content}, ${author ?? null}, ${date ?? null}, ${image ?? null}, ${category ?? null}, ${published !== false})
            RETURNING id, slug, title, excerpt, author, category, date, image, published, created_at, updated_at
          `

          const post = Array.isArray(rows) ? rows[0] : null
          return json({ post }, { status: 201 })
        } catch (error: unknown) {
          console.error('Blog create error:', error)
          if (
            error instanceof Error &&
            error.message?.includes('unique')
          ) {
            return json(
              { error: 'A post with this slug already exists' },
              { status: 409 }
            )
          }
          return json(
            { error: 'Failed to create blog post' },
            { status: 500 }
          )
        }
      },
    },
  },
})
