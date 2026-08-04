// Global Language Map
export const langMap = {
  'de': ['de-DE'],
  'en': ['en-US'],
  'es': ['es-ES'],
  'fr': ['fr-FR'],
  'ja': ['ja-JP'],
  'ko': ['ko-KR'],
  'pl': ['pl-PL'],
  'pt': ['pt-BR'],
  'ru': ['ru-RU'],
  'zh': ['zh-CN'],
  'zh-tw': ['zh-TW'],
} as const

// Supported Languages
export type Language = keyof typeof langMap

// Endonyms — each language named in itself, so the switcher label is legible
// to the reader it is offering the switch to.
export const langNameMap: Record<Language, string> = {
  'de': 'Deutsch',
  'en': 'English',
  'es': 'Español',
  'fr': 'Français',
  'ja': '日本語',
  'ko': '한국어',
  'pl': 'Polski',
  'pt': 'Português',
  'ru': 'Русский',
  'zh': '简体中文',
  'zh-tw': '繁體中文',
}

// Giscus Language Map
// https://giscus.app/
export const giscusLocaleMap: Record<Language, string> = {
  'de': 'de',
  'en': 'en',
  'es': 'es',
  'fr': 'fr',
  'ja': 'ja',
  'ko': 'ko',
  'pl': 'pl',
  'pt': 'pt',
  'ru': 'ru',
  'zh': 'zh-CN',
  'zh-tw': 'zh-TW',
}

// Twikoo Language Map
// https://github.com/twikoojs/twikoo/blob/main/src/client/utils/i18n/index.js
export const twikooLocaleMap: Record<Language, string> = {
  'de': 'en', // fallback to English
  'en': 'en',
  'es': 'en', // fallback to English
  'fr': 'en', // fallback to English
  'ja': 'ja',
  'ko': 'ko',
  'pl': 'en', // fallback to English
  'pt': 'en', // fallback to English
  'ru': 'en', // fallback to English
  'zh': 'zh-cn',
  'zh-tw': 'zh-tw',
}

// Waline Language Map
// https://waline.js.org/en/guide/features/i18n.html
export const walineLocaleMap: Record<Language, string> = {
  'de': 'en-US', // fallback to English
  'en': 'en-US',
  'es': 'es',
  'fr': 'fr-FR',
  'ja': 'jp-JP',
  'ko': 'en-US', // fallback to English
  'pl': 'en-US', // fallback to English
  'pt': 'pt-BR',
  'ru': 'ru-RU',
  'zh': 'zh-CN',
  'zh-tw': 'zh-TW',
}
