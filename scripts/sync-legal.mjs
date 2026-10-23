import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const root = path.resolve(site, '..')
const source = fs.readFileSync(path.join(site, 'lib/legal/documents.json'), 'utf8')
const manifest = JSON.parse(source)
if (manifest.documents.some(doc => doc.published && doc.editorial_status !== 'final')) throw Error('Only final editorial copy can be published')
if (manifest.documents.some(doc => /\bAI\b|artificial intelligence|\bquiz\b|\[INSERT/i.test([doc.title, ...doc.sections.flatMap(s => [s.heading, ...s.paragraphs])].join('\n')))) throw Error('Launch text contains excluded terminology or placeholders')
const digest = crypto.createHash('sha256').update(source).digest('hex')
const archivePath = path.join(site, 'lib/legal/versions.json')
const archive = fs.existsSync(archivePath) ? JSON.parse(fs.readFileSync(archivePath, 'utf8')) : []
for (const document of manifest.documents) {
  const index = archive.findIndex(previous => previous.id === document.id && previous.audience === document.audience && previous.version === document.version)
  const previous = archive[index]
  if (previous?.published && JSON.stringify(previous) !== JSON.stringify(document)) throw Error(`Published version is immutable: ${document.audience}/${document.id}/${document.version}`)
  if (index >= 0) archive[index] = document
  else archive.push(document)
}
const payload = { source_sha256: digest, base_url: manifest.base_url, documents: {}, provider_documents: {}, review_issues: manifest.review_issues }
for (const doc of manifest.documents) {
  if (!['tos', 'privacy_policy', 'health_data', 'marketing', 'ugc_guidelines', 'guardians'].includes(doc.id)) continue
  const text = [doc.title, `Version ${doc.version}`, ...doc.sections.flatMap(s => [s.heading, ...s.paragraphs])].join('\n\n')
  const group = doc.audience === 'provider' ? payload.provider_documents : payload.documents
  const entry = { title: doc.title, version: doc.version, required: doc.required, published: doc.published, content: text, url: `${manifest.base_url}/legal/${doc.audience}-${doc.id}/${doc.version}` }
  if (doc.id === 'guardians') payload.guardian_notice = entry
  else group[doc.id] = entry
}
const outputs = new Map([
 [archivePath, JSON.stringify(archive, null, 2) + '\n'],
 [path.join(root, 'cozy-health-api-main/resources/legal/launch.json'), JSON.stringify(payload, null, 2) + '\n'],
 [path.join(root, 'cozy-health-mobile-app-main-main/assets/legal/documents.json'), source],
])
for (const document of manifest.documents) {
  const status = document.published ? 'Published' : document.editorial_status === 'final' ? 'Final copy — not yet effective' : 'Review draft'
  const markdown = [`<!-- Generated from landing-page lib/legal/documents.json. Edit that source and regenerate. -->`, `# ${document.title}`, `${status} · Version ${document.version} · ${document.updated}`, `Public route: ${manifest.base_url}${document.route}`, ...document.sections.flatMap(section => [`## ${section.heading}`, ...section.paragraphs])].join('\n\n') + '\n'
  outputs.set(path.join(root, 'docs/legal/generated', `${document.audience}-${document.id}.md`), markdown)
}
for (const [dest, content] of outputs) {
  // Each repository can validate its own archive in CI. Use --workspace to
  // additionally verify generated artifacts in the sibling API/app repositories.
  if (process.argv.includes('--check') && !process.argv.includes('--workspace') && !dest.startsWith(site + path.sep)) continue
  if (process.argv.includes('--check')) { if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8') !== content) throw Error(`Stale legal artifact: ${dest}`) }
  else { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, content) }
}
console.log(`Legal artifacts ${process.argv.includes('--check') ? 'verified' : 'generated'}: ${digest}`)
