import { pageMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import { LegalDocument } from '@/components/legal-document'
import { legalArchives } from '@/lib/legal/documents'
export function generateStaticParams() { return legalArchives.map(doc => ({ document: `${doc.audience}-${doc.id}`, version: doc.version })) }
export async function generateMetadata({ params }: { params: Promise<{ document: string; version: string }> }) {
  const { document, version } = await params
  const doc = legalArchives.find(item => `${item.audience}-${item.id}` === document && item.version === version)
  if (!doc) notFound()
  return pageMetadata('/legal/' + document + '/' + version, doc.title + ' ? ' + version + ' | Cozy Health', 'Archived version ' + version + ' of the Cozy Health ' + doc.title + '.', false)
}
export default async function Archive({ params }: { params: Promise<{ document: string; version: string }> }) {
  const { document, version } = await params
  const doc = legalArchives.find(item => `${item.audience}-${item.id}` === document && item.version === version)
  if (!doc) notFound()
  return <LegalDocument document={doc} archived />
}
