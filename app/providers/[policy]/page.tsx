import { notFound } from 'next/navigation'
import { LegalDocument } from '@/components/legal-document'
import { legalDocuments, findDocument } from '@/lib/legal/documents'
export function generateStaticParams() { return legalDocuments.filter(doc => doc.audience === 'provider').map(doc => ({ policy: doc.route.split('/').at(-1) })) }
export async function generateMetadata({ params }: { params: Promise<{ policy: string }> }) { const { policy } = await params; const doc = findDocument(`/providers/${policy}`); return { title: doc ? `${doc.title} | Cozy Health` : 'Cozy Health', robots: doc?.published ? undefined : { index: false, follow: false } } }
export default async function Policy({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params
  const doc = findDocument(`/providers/${policy}`)
  if (!doc) notFound()
  return <LegalDocument document={doc} />
}
