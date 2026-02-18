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

import { JsonLd, buildOrganizationJsonLd, SEO_DEFAULT_DESCRIPTION, SEO_DEFAULT_OG_IMAGE, SEO_SITE_NAME, SEO_SITE_ORIGIN } from '../seo'

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
        title: `${SEO_SITE_NAME} | Downtown Bula`,
      },
      {
        name: 'description',
        content: SEO_DEFAULT_DESCRIPTION,
      },
      // Open Graph
      {
        property: 'og:title',
        content: `${SEO_SITE_NAME} | Downtown Bula`,
      },
      {
        property: 'og:description',
        content: SEO_DEFAULT_DESCRIPTION,
      },
      {
        property: 'og:image',
        content: SEO_DEFAULT_OG_IMAGE,
      },
      {
        property: 'og:url',
        content: SEO_SITE_ORIGIN,
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
        content: `${SEO_SITE_NAME} | Downtown Bula`,
      },
      {
        name: 'twitter:description',
        content: SEO_DEFAULT_DESCRIPTION,
      },
      {
        name: 'twitter:image',
        content: SEO_DEFAULT_OG_IMAGE,
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
        <JsonLd data={buildOrganizationJsonLd()} />
        {children}
        {import.meta.env.DEV && (
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
        )}
        <Scripts />
      </body>
    </html>
  )
}
