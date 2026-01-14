export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  image: string
  category: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'welcome-to-water-street-commons',
    title: 'Welcome to Water Street Commons',
    excerpt:
      'We\'re thrilled to announce the opening of Water Street Commons, a vibrant new space for local makers and entrepreneurs in Downtown Bula.',
    content: `# Welcome to Water Street Commons

We're thrilled to announce the opening of Water Street Commons, a vibrant new space for local makers and entrepreneurs in Downtown Bula.

## A New Beginning

Water Street Commons represents a bold new initiative by the Downtown Development Authority to activate underutilized riverfront space and provide affordable retail opportunities for emerging entrepreneurs. Our five tiny-but-mighty retail spaces are perfectly designed for artisans, bakers, and makers looking for their first storefront.

## What Makes Us Special

- **Affordable Rent**: We believe in supporting local businesses from day one
- **Built-in Foot Traffic**: Located in the heart of Downtown Bula's social district
- **Community Support**: Join a network of passionate creators and makers
- **Riverside Location**: Beautiful views of the Thunder Bay River

## Join Us

Applications for our 2026 season are now open. Whether you're a seasoned maker or just starting out, we'd love to hear from you.`,
    author: 'Downtown Development Authority',
    date: '2025-01-15',
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=1200&auto=format&fit=crop',
    category: 'Announcements',
  },
  {
    slug: 'meet-our-first-vendors',
    title: 'Meet Our First Vendors',
    excerpt:
      'Get to know the talented makers who will be opening shop at Water Street Commons this season.',
    content: `# Meet Our First Vendors

We're excited to introduce you to the talented makers who will be opening shop at Water Street Commons this season.

## The Artisan Collective

Our first group of vendors represents the best of what Bula has to offer. From handmade jewelry to artisanal baked goods, each vendor brings something unique to our community.

## What to Expect

- **Handcrafted Goods**: Discover one-of-a-kind items made with care
- **Local Flavors**: Taste the best of Northern Michigan
- **Unique Finds**: Shop items you won't find anywhere else

Stay tuned for more vendor spotlights as we get closer to opening day!`,
    author: 'Water Street Commons Team',
    date: '2025-01-10',
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=1200&auto=format&fit=crop',
    category: 'Vendors',
  },
  {
    slug: 'social-district-guide',
    title: 'Your Guide to the Social District',
    excerpt:
      'Everything you need to know about enjoying beverages while shopping and strolling in Downtown Bula.',
    content: `# Your Guide to the Social District

Downtown Bula is proud to be an official social district, which means you can enjoy your favorite beverages while shopping and exploring.

## How It Works

The social district allows you to purchase alcoholic beverages from participating establishments and enjoy them within the designated district boundaries. This creates a unique shopping and dining experience that brings the community together.

## Rules & Guidelines

- Beverages must be in designated cups from participating establishments
- Stay within the clearly marked district boundaries
- Be respectful of other visitors and businesses
- Dispose of cups properly in designated receptacles

## Where to Get Your Beverage

Our Anchor Shed will be serving up delicious drinks perfect for enjoying while you browse the shops or relax by the river.`,
    author: 'Downtown Development Authority',
    date: '2025-01-05',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop',
    category: 'Visit',
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}
