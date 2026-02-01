# Andy's Blog (andydai.dev)

Astro-based personal blog with i18n support (zh-tw + en).

## Multi-language Content

### Adding a New Post

1. Create Chinese version in `src/content/posts/[slug].md` with:
   ```yaml
   lang: zh-tw
   abbrlink: [slug]  # Required for linking to English version
   ```

2. Create English version in `src/content/posts/[slug]-en.md` with:
   ```yaml
   lang: en
   abbrlink: [slug]  # Must match Chinese version's abbrlink
   ```

3. Both versions will automatically get:
   - Self-canonical URLs
   - Mutual hreflang references
   - Correct `<html lang>` attribute

### URL Structure

- Chinese (default): `/posts/[slug]/`
- English: `/en/posts/[slug]/`

### SEO/AEO Checklist for English Versions

- Title should be natural English, not direct translation
- Rewrite examples that are Taiwan-specific context
- Meta description in English
- Don't use逐字翻譯 - maintain the author's voice and directness

### Technical Implementation

- `abbrlink` in frontmatter determines the URL slug (falls back to filename)
- `supportedLangs` prop passed through Layout → Head for hreflang generation
- hreflang only appears when a post has multiple language versions
