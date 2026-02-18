import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { getSessionToken, verifySessionToken } from '../auth'

export const Route = createFileRoute('/api/auth/check')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const token = getSessionToken(request)
          if (!token) {
            return json({ authenticated: false })
          }

          const valid = await verifySessionToken(token)
          return json({ authenticated: valid })
        } catch {
          return json({ authenticated: false })
        }
      },
    },
  },
})
