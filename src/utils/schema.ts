import { themeConfig } from '@/config'

/**
 * Stable @id for the author entity, shared by every page that describes Andy.
 * Keeping it language-independent lets search/answer engines merge /about/ and
 * /en/about/ into a single Person instead of two lookalike entities.
 */
export const PERSON_ID = `${themeConfig.site.url}/about/#andy-dai`

const SOCIAL_LINKS = ['GitHub', 'X', 'LinkedIn']

export function personSameAs(): string[] {
  return themeConfig.footer.links
    .filter(link => SOCIAL_LINKS.includes(link.name))
    .map(link => link.url)
}
