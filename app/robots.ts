import type { MetadataRoute } from 'next'
import { isProduction, siteUrl } from '@/lib/seo'
export default function robots(): MetadataRoute.Robots {
 return { rules: { userAgent: '*', allow: '/', ...(isProduction ? { disallow: ['/api/'] } : {}) }, ...(isProduction ? { sitemap: siteUrl + '/sitemap.xml' } : {}) }
}
