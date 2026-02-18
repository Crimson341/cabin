import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { getClient } from '../db'
import { requireAuth } from '../auth'

export const Route = createFileRoute('/api/dashboard/stats')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const authError = await requireAuth(request)
        if (authError) return authError

        try {
          const client = await getClient()
          if (!client) {
            return json({ error: 'Database not configured' }, { status: 500 })
          }

          const totalRows = await client`SELECT COUNT(*) as count FROM contact_submissions`
          const weekRows = await client`SELECT COUNT(*) as count FROM contact_submissions WHERE created_at >= NOW() - INTERVAL '7 days'`
          const monthRows = await client`SELECT COUNT(*) as count FROM contact_submissions WHERE created_at >= NOW() - INTERVAL '30 days'`
          const interestBreakdown = await client`SELECT interest, COUNT(*) as count FROM contact_submissions WHERE interest IS NOT NULL GROUP BY interest ORDER BY count DESC`

          const total = Array.isArray(totalRows) ? (totalRows[0] as Record<string, unknown>) : null
          const week = Array.isArray(weekRows) ? (weekRows[0] as Record<string, unknown>) : null
          const month = Array.isArray(monthRows) ? (monthRows[0] as Record<string, unknown>) : null

          return json({
            total: Number(total?.count ?? 0),
            thisWeek: Number(week?.count ?? 0),
            thisMonth: Number(month?.count ?? 0),
            byInterest: Array.isArray(interestBreakdown) ? interestBreakdown : [],
          })
        } catch (error) {
          console.error('Dashboard stats error:', error)
          return json({ error: 'Failed to fetch stats' }, { status: 500 })
        }
      },
    },
  },
})
