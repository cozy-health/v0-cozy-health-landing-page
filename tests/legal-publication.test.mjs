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
test('current documents have the approved effective date without erasing operational review issues', () => {
  assert.ok(manifest.review_issues.length > 0)
  for (const doc of manifest.documents) {
    assert.equal(doc.editorial_status, 'final')
    assert.equal(doc.published, true)
    assert.equal(doc.effective_date, '2026-10-29')
    assert.equal(doc.version, '1.1')
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
  assert.equal(manifest.documents.some(doc => doc.route === '/guardians'), false)
})

test('current legal copy describes confirmed written sharing and immediate/14-day evidence cleanup', () => {
  const privacy = manifest.documents.find(doc => doc.route === '/privacy')
  const content = JSON.stringify(privacy)
  assert.match(content, /written entry.*title and body/i)
  assert.match(content, /14 days/)
  assert.match(content, /immediately/i)
  for (const doc of manifest.documents) assert.doesNotMatch(JSON.stringify(doc.sections), /need the applicable verified guardian authorization|we ask for date of birth and country of residence/i)
  const archive = JSON.parse(fs.readFileSync(new URL('../lib/legal/versions.json', import.meta.url)))
  assert.ok(archive.some(doc => doc.id === 'guardians' && doc.version === '1.0'))
})
test('website legal version archive matches the publication source', () => {
  execFileSync(process.execPath, ['scripts/sync-legal.mjs','--check'], { cwd: new URL('..', import.meta.url) })
})
