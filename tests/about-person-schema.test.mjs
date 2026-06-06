/* eslint-disable test/no-import-node-test */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const repoDir = new URL('..', import.meta.url)
const cwd = repoDir.pathname

function buildSite() {
  execFileSync('npx', ['astro', 'build'], {
    cwd,
    stdio: 'pipe',
    env: {
      ...process.env,
      CI: '1',
    },
  })
}

function extractJsonLdObjects(html) {
  return Array.from(html.matchAll(/<script[^>]*type=(?:"application\/ld\+json"|'application\/ld\+json'|application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g))
    .map(match => JSON.parse(match[1]))
}

test('about page outputs a Person JSON-LD schema', () => {
  buildSite()

  const html = readFileSync(join(cwd, 'dist', 'about', 'index.html'), 'utf8')
  const jsonLdObjects = extractJsonLdObjects(html)
  const personSchema = jsonLdObjects.find(obj => obj['@type'] === 'Person')

  assert.ok(personSchema, 'Expected /about/ to include a Person JSON-LD schema')
  assert.equal(personSchema.name, 'Andy Dai')
  assert.equal(personSchema.url, 'https://andydai.dev/about/')
  assert.deepEqual(personSchema.sameAs, [
    'https://github.com/daikeren',
    'https://x.com/_andydai',
    'https://www.linkedin.com/in/andy-dai-b3ab3335/',
  ])
})

test('localized about page outputs a Person JSON-LD schema with the localized URL', () => {
  buildSite()

  const html = readFileSync(join(cwd, 'dist', 'en', 'about', 'index.html'), 'utf8')
  const jsonLdObjects = extractJsonLdObjects(html)
  const personSchema = jsonLdObjects.find(obj => obj['@type'] === 'Person')

  assert.ok(personSchema, 'Expected /en/about/ to include a Person JSON-LD schema')
  assert.equal(personSchema.url, 'https://andydai.dev/en/about/')
  assert.equal(personSchema.description, 'CTO and co-founder at Codeer.ai. Writes about AI, engineering teams, and startup execution.')
})
