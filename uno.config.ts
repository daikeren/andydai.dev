import type { Preset } from 'unocss'
import {
  defineConfig,
  presetAttributify,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetTheme from 'unocss-preset-theme'
import { themeConfig } from './src/config.ts'

const { light, dark } = themeConfig.color

// Shared font stacks. "CJK" is the size-adjusted alias declared in
// src/styles/font.css; it carries a CJK-only unicode-range, so Latin always
// resolves to Mona Sans regardless of where the alias sits in the stack.
const SANS = ['Mona Sans', 'CJK', 'system-ui', '-apple-system', 'PingFang TC', 'Heiti TC', 'Microsoft JhengHei', 'Noto Sans TC', 'sans-serif']
const MONO = ['JetBrains Mono', 'CJK', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace']

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
    presetTheme({
      theme: {
        dark: {
          colors: {
            ...dark,
            note: 'oklch(70.7% 0.165 254.624)', // blue-400
            tip: 'oklch(76.5% 0.177 163.223)', // emerald-400
            important: 'oklch(71.4% 0.203 305.504)', // purple-400
            warning: 'oklch(82.8% 0.189 84.429)', // amber-400
            caution: 'oklch(70.4% 0.191 22.216)', // red-400
          },
        },
      },
    }) as Preset<object>,
  ],
  theme: {
    colors: {
      ...light,
      note: 'oklch(48.8% 0.243 264.376)', // blue-700
      tip: 'oklch(50.8% 0.118 165.612)', // emerald-700
      important: 'oklch(49.6% 0.265 301.924)', // purple-700
      warning: 'oklch(55.5% 0.163 48.998)', // amber-700
      caution: 'oklch(50.5% 0.213 27.518)', // red-700
    },
    fontFamily: {
      // Latin → Mona Sans; CJK → the "CJK" alias, which re-exposes the system
      // CJK font at size-adjust 92% so both scripts share an optical size
      // (see src/styles/font.css). The raw system names stay after it as the
      // fallback for platforms where no local() face matches.
      sans: [...SANS],
      // Monospace signature → JetBrains Mono (metadata + code).
      mono: [...MONO],
      // Display / wordmark / headings.
      title: [...SANS],
      // Navigation + UI labels.
      navbar: [...SANS],
      // Metadata: dates, reading time, tags, year ticks.
      time: [...MONO],
      // Retained alias (legacy refs) → resolves to the body sans stack.
      serif: [...SANS],
    },
  },
  // Force emission of the accent theme variable: it is referenced only via
  // raw oklch(var(--un-preset-theme-colors-accent)) in CSS, never as a utility,
  // so preset-theme would otherwise never define the variable.
  safelist: ['bg-accent', 'c-accent', 'border-accent'],
  rules: [
    ['scrollbar-hidden', {
      'scrollbar-width': 'none',
      '-ms-overflow-style': 'none',
    }],
  ],
  shortcuts: {
    'uno-decorative-line': 'mb-4.5 h-0.25 w-10 bg-secondary/25 lg:(mb-6 w-11)',
    'uno-round-border': 'border border-secondary/5 rounded border-solid',
  },
  variants: [
    (matcher) => {
      if (!matcher.startsWith('cjk:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(4),
        selector: s => `${s}:is(:lang(zh), :lang(ja), :lang(ko))`,
      }
    },
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
