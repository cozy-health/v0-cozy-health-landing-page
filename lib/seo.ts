import type { Metadata } from 'next'
export const isProduction = process.env.COZY_DEPLOYMENT_ENV === 'production'
export const siteUrl = isProduction ? 'https://cozyhealth.org' : 'https://dev.cozyhealth.org'
export const publicPages = [
 { path: '/', title: 'Cozy Health | Mental Health Care That Stays With You', description: 'Continuous mental health care before, between, and after sessions. Explore self-care tools, mood tracking and personal insights with Cozy Health.' },
 { path: '/plans', title: 'Plans | Cozy Health', description: 'Explore Cozy Health Standard, Student and Premium plans for journaling, mood tracking and support you choose to share.' },
 { path: '/waitlist', title: 'Join the Waitlist | Cozy Health', description: 'Join the Cozy Health waitlist for updates on self-care tools, mood tracking and connected care.' },
 { path: '/legal', title: 'Policies & Trust | Cozy Health', description: 'Read Cozy Health policies for our community and providers, including privacy, terms and your choices.' },
]
export function pageMetadata(path: string, title: string, description: string, index = true): Metadata {
 const url = siteUrl + path
 return { title, description, alternates: { canonical: url }, robots: { index: isProduction && index, follow: index },
 openGraph: { type: 'website', siteName: 'Cozy Health', url, title, description, images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Cozy Health: care that stays with you' }] },
 twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] } }
}
export function publicPageMetadata(path: string): Metadata {
 const page = publicPages.find(item => item.path === path)
 if (!page) throw new Error('Missing page metadata: ' + path)
 return pageMetadata(path, page.title, page.description)
}
