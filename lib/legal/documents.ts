import manifest from './documents.json'
import archives from './versions.json'
export const legalArchives = archives
export const legalManifest = manifest
export const legalDocuments = manifest.documents
export type LegalDocument = Omit<(typeof legalDocuments)[number], 'effective_date'> & { effective_date?: string }
export function findDocument(route: string) { return legalDocuments.find(document => document.route === route) }
export function documentText(document: LegalDocument) { return [document.title, `Version ${document.version}`, ...(document.effective_date ? [`Effective ${document.effective_date}`] : []), ...document.sections.flatMap(section => [section.heading, ...section.paragraphs])].join('\n\n') }
