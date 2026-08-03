import type { CollectionEntry } from 'astro:content'
import { OGImageRoute } from 'astro-og-canvas'
import { getCollection } from 'astro:content'
import { allLocales } from '@/config'
import { ui } from '@/i18n/ui'
import { getPostDescription } from '@/utils/description'
import { getSiteImageId } from '@/utils/og'

// eslint-disable-next-line antfu/no-top-level-await
const posts = await getCollection('posts')

// Create slug-to-metadata lookup object for blog posts
const postPages = Object.fromEntries(
  posts.map((post: CollectionEntry<'posts'>) => [
    post.id,
    {
      title: post.data.seoTitle || post.data.title,
      description: getPostDescription(post, 'og'),
    },
  ]),
)

// Site-level cards for every page that isn't a post (home, about, tags, 404)
const sitePages = Object.fromEntries(
  allLocales.map(lang => [
    getSiteImageId(lang),
    {
      title: ui[lang].title,
      description: ui[lang].subtitle,
    },
  ]),
)

const pages = { ...postPages, ...sitePages }

// Configure Open Graph image generation route
// eslint-disable-next-line antfu/no-top-level-await
export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    logo: {
      path: './public/icons/og-logo.png', // Required local path and PNG format
      size: [250],
    },
    border: {
      color: [242, 241, 245],
      width: 20,
    },
    font: {
      title: {
        families: ['Noto Sans SC'],
        weight: 'Bold',
        color: [34, 33, 36],
        lineHeight: 1.5,
      },
      description: {
        families: ['Noto Sans SC'],
        color: [72, 71, 74],
        lineHeight: 1.5,
      },
    },
    fonts: [
      // Build-only fonts kept outside public/ so the 16MB OTFs don't ship to dist
      './fonts/NotoSansSC-Bold.otf',
      './fonts/NotoSansSC-Regular.otf',
    ],
    bgGradient: [[242, 241, 245]],
  }),
})
