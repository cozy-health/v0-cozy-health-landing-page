import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const read = file => JSON.parse(fs.readFileSync(new URL(file, import.meta.url), 'utf8'))
const current = read('../lib/legal/documents.json').documents
const archive = read('../lib/legal/versions.json')
const drafts = read('../lib/legal/drafts/voice-sharing.json').documents

test('published voice-sharing revisions match approved drafts and preserve previous versions', () => {
  assert.equal(drafts.length, 3)
  for (const draft of drafts) {
    assert.equal(draft.version, '1.2')
    assert.equal(draft.published, false)
    assert.equal(draft.effective_date, undefined)
    const published = current.find(doc => doc.id === draft.id && doc.audience === draft.audience)
    assert.ok(published)
    assert.equal(published.version, '1.2')
    assert.equal(published.published, true)
    assert.equal(published.effective_date, '2026-11-07')
    assert.deepEqual(published.sections, draft.sections)
    const previous = archive.find(doc => doc.id === published.id && doc.audience === published.audience && doc.version === '1.1')
    assert.ok(previous)
    assert.equal(previous.published, true)
    assert.equal(previous.effective_date, '2026-10-29')
    assert.deepEqual(archive.find(doc => doc.id === published.id && doc.audience === published.audience && doc.version === published.version), published)
  }
})

test('revisions preserve unrelated legal sections and require selected audio sharing without transcription', () => {
  for (const draft of drafts) {
    assert.doesNotMatch(JSON.stringify(draft), /\u2014/)
    const previous = archive.find(doc => doc.id === draft.id && doc.audience === draft.audience && doc.version === '1.1')
    const changed = draft.sections.filter((section, index) => JSON.stringify(section) !== JSON.stringify(previous.sections[index]))
    assert.equal(changed.length, 1)
    assert.equal(draft.sections.length, previous.sections.length)
    const text = changed[0].paragraphs.join(' ')
    assert.match(text, /preview and explicitly confirm/)
    assert.match(text, /online playback|play that selected recording online/)
    assert.match(text, /connection/)
    assert.match(text, /permission/)
    assert.match(text, /individual share/)
    assert.match(text, /does not.*transcript/)
    assert.match(text, /Revoking|withdrawal|Withdrawal/)
  }
})
