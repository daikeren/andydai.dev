/* eslint-disable test/no-import-node-test */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const repoDir = new URL('..', import.meta.url)
const cwd = repoDir.pathname

let built = false
function buildSite() {
  if (built)
    return
  execFileSync('npx', ['astro', 'build'], {
    cwd,
    stdio: 'pipe',
    env: {
      ...process.env,
      CI: '1',
    },
  })
  built = true
}

function readPage(...segments) {
  return readFileSync(join(cwd, 'dist', ...segments, 'index.html'), 'utf8')
}

function extractJsonLdObjects(html) {
  return Array.from(html.matchAll(/<script[^>]*type=(?:"application\/ld\+json"|'application\/ld\+json'|application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g))
    .map(match => JSON.parse(match[1]))
}

function extractOgImage(html) {
  const match = html.match(/<meta[^>]*property=og:image[^>]*>/)
    ?? html.match(/<meta[^>]*property="og:image"[^>]*>/)
  assert.ok(match, 'Expected page to declare an og:image meta tag')
  return match[0].match(/content="?([^"\s>]+)"?/)[1]
}

// Non-post pages used to fall back to the upstream theme's hardcoded apiflash
// screenshot of retypeset.radishzz.cc, so sharing the homepage showed someone
// else's site. Every page must serve an og:image from our own origin.
for (const [label, segments] of [
  ['homepage', []],
  ['English homepage', ['en']],
  ['about page', ['about']],
  ['tags page', ['tags']],
]) {
  test(`${label} serves a self-hosted og:image`, () => {
    buildSite()

    const ogImage = extractOgImage(readPage(...segments))

    assert.ok(
      ogImage.startsWith('https://andydai.dev/og/'),
      `Expected a self-hosted og:image, got ${ogImage}`,
    )
    assert.ok(!ogImage.includes('apiflash'), 'og:image must not proxy through apiflash')
    assert.ok(!ogImage.includes('retypeset'), 'og:image must not point at the upstream theme demo')
  })
}

test('homepage outputs a WebSite JSON-LD schema', () => {
  buildSite()

  const jsonLdObjects = extractJsonLdObjects(readPage())
  const websiteSchema = jsonLdObjects.find(obj => obj['@type'] === 'WebSite')

  assert.ok(websiteSchema, 'Expected / to include a WebSite JSON-LD schema')
  assert.equal(websiteSchema.url, 'https://andydai.dev/')
  assert.equal(websiteSchema.name, 'Andy\'s System')
  assert.equal(websiteSchema.inLanguage, 'zh-TW')
  assert.equal(websiteSchema.author['@id'], 'https://andydai.dev/about/#andy-dai')
  assert.deepEqual(websiteSchema.author.sameAs, [
    'https://github.com/daikeren',
    'https://x.com/_andydai',
    'https://www.linkedin.com/in/andy-dai-b3ab3335/',
  ])
})

test('localized homepage outputs a WebSite JSON-LD schema with the localized URL', () => {
  buildSite()

  const jsonLdObjects = extractJsonLdObjects(readPage('en'))
  const websiteSchema = jsonLdObjects.find(obj => obj['@type'] === 'WebSite')

  assert.ok(websiteSchema, 'Expected /en/ to include a WebSite JSON-LD schema')
  assert.equal(websiteSchema.url, 'https://andydai.dev/en/')
  assert.equal(websiteSchema.inLanguage, 'en-US')
  // The Person entity is shared across languages so AI engines resolve one author.
  assert.equal(websiteSchema.author['@id'], 'https://andydai.dev/about/#andy-dai')
})
