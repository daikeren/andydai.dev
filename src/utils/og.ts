import type { Language } from '@/i18n/config'
import { defaultLocale } from '@/config'

/**
 * OG image id for pages that aren't posts (home, about, tags, 404).
 * Shared by the /og/ route and Head.astro so both agree on the filename.
 */
export function getSiteImageId(lang: Language): string {
  return lang === defaultLocale ? 'site' : `site-${lang}`
}
