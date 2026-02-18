import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { z } from 'zod'
import { getClient } from '../db'

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(30).optional(),
  interest: z.string().max(100).optional(),
  message: z.string().min(1).max(5000),
})

export const Route = createFileRoute('/api/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const parsed = ContactSchema.safeParse(body)

          if (!parsed.success) {
            return json(
              { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
              { status: 400 }
            )
          }

          const { name, email, phone, interest, message } = parsed.data

          const client = getClient()

          if (!client) {
            return json({ error: 'Database not configured' }, { status: 500 })
          }

          await client`
            INSERT INTO contact_submissions (name, email, phone, interest, message)
            VALUES (${name}, ${email}, ${phone ?? null}, ${interest ?? null}, ${message})
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
