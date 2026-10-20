import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
const manifest = JSON.parse(fs.readFileSync(new URL('../lib/legal/documents.json', import.meta.url)))
test('public routes include the requested consumer and provider documents', () => {
  const routes = new Set(manifest.documents.map(doc => doc.route))
  for (const route of ['/privacy','/terms','/health-disclosures','/community-standards','/support','/cookies','/providers/terms','/providers/privacy']) assert.ok(routes.has(route), route)
  assert.equal(routes.size, manifest.documents.length)
})
test('launch copy excludes AI, quiz terminology and unresolved insert placeholders', () => {
  for (const doc of manifest.documents) assert.doesNotMatch(JSON.stringify(doc), /\bAI\b|\bquiz\b|\[INSERT/i)
})
test('unresolved review issues keep documents unavailable for acceptance', () => {
  assert.ok(manifest.review_issues.length > 0)
  assert.ok(manifest.documents.every(doc => doc.published === false))
})
test('website legal version archive matches the publication source', () => {
  execFileSync(process.execPath, ['scripts/sync-legal.mjs','--check'], { cwd: new URL('..', import.meta.url) })
})
