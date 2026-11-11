import type { MetadataRoute } from 'next'
import { legalDocuments } from '@/lib/legal/documents'
import { isProduction, publicPages, siteUrl } from '@/lib/seo'
export default function sitemap(): MetadataRoute.Sitemap {
 if (!isProduction) return []
 const paths = [...publicPages.map(page => page.path), ...legalDocuments.filter(doc => doc.published).map(doc => doc.route)]
 return [...new Set(paths)].map(path => ({ url: siteUrl + path }))
}
