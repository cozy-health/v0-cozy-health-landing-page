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
test('operationally blocked acceptance documents remain unpublished while information pages can be published', () => {
  assert.ok(manifest.review_issues.length > 0)
  for (const doc of manifest.documents) {
    assert.equal(doc.editorial_status, 'final')
    if (['tos', 'privacy_policy', 'health_data', 'marketing', 'guardians'].includes(doc.id)) assert.equal(doc.published, false)
  }
  for (const route of ['/support', '/cookies', '/health-disclosures', '/community-standards']) {
    assert.equal(manifest.documents.find(doc => doc.route === route)?.published, true)
  }
})

test('final notices contain confirmed operator details and no unfinished editorial instructions', () => {
  const privacy = manifest.documents.find(doc => doc.route === '/privacy')
  assert.match(JSON.stringify(privacy), /8215009/)
  assert.match(JSON.stringify(privacy), /Igwe Street, Rumuodara, Rivers State, Nigeria/)
  const support = manifest.documents.find(doc => doc.route === '/support')
  assert.match(JSON.stringify(support), /shared team queue/)
  assert.match(JSON.stringify(support), /8am and 5pm West Africa Time/)
  for (const doc of manifest.documents) assert.doesNotMatch(JSON.stringify(doc.sections), /must be finalized before publication|Before release, we will identify|inventory.*must be verified|before publishing an inventory/i)
  assert.ok(manifest.documents.some(doc => doc.route === '/guardians'))
})
test('website legal version archive matches the publication source', () => {
  execFileSync(process.execPath, ['scripts/sync-legal.mjs','--check'], { cwd: new URL('..', import.meta.url) })
})
