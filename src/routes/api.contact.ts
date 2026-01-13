import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { getClient } from '../db'

export const Route = createFileRoute('/api/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { name, email, phone, interest, message } = body

          if (!name || !email || !message) {
            return json(
              { error: 'Name, email, and message are required' },
              { status: 400 }
            )
          }

          const client = await getClient()

          if (!client) {
            return json({ error: 'Database not configured' }, { status: 500 })
          }

          await client`
            INSERT INTO contact_submissions (name, email, phone, interest, message)
            VALUES (${name}, ${email}, ${phone || null}, ${interest || null}, ${message})
          `

          return json({ success: true, message: 'Thank you for reaching out!' })
        } catch (error) {
          console.error('Contact form error:', error)
          return json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
          )
        }
      },
    },
  },
})
