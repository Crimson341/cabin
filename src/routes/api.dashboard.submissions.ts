import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { getClient } from '../db'
import { requireAuth } from '../auth'

export const Route = createFileRoute('/api/dashboard/submissions')({
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
          const limit = Math.min(Number(url.searchParams.get('limit') ?? 50), 200)
          const offset = Math.max(Number(url.searchParams.get('offset') ?? 0), 0)

          const rows = await client`
            SELECT id, name, email, phone, interest, message, created_at
            FROM contact_submissions
            ORDER BY created_at DESC
            LIMIT ${limit} OFFSET ${offset}
          `
          return json({ submissions: rows })
        } catch (error) {
          console.error('Dashboard submissions error:', error)
          return json({ error: 'Failed to fetch submissions' }, { status: 500 })
        }
      },
    },
  },
})
