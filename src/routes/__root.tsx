import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Water Street Commons | Downtown Alpena',
      },
      {
        name: 'description',
        content:
          'A colorful riverside nook in Downtown Alpena. Five tiny shops for local makers to grow, share, and sparkle.',
      },
      // Open Graph
      {
        property: 'og:title',
        content: 'Water Street Commons | Downtown Alpena',
      },
      {
        property: 'og:description',
        content:
          'A colorful riverside nook in Downtown Alpena. Five tiny shops for local makers to grow, share, and sparkle.',
      },
      {
        property: 'og:image',
        content:
          'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop',
      },
      {
        property: 'og:url',
        content: 'https://waterstreetcommons.com',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      // Twitter
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Water Street Commons | Downtown Alpena',
      },
      {
        name: 'twitter:description',
        content:
          'A colorful riverside nook in Downtown Alpena. Five tiny shops for local makers to grow, share, and sparkle.',
      },
      {
        name: 'twitter:image',
        content:
          'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop',
      },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
