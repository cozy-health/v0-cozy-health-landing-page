import { siteUrl, publicPageMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AnalyticsChoice } from '@/components/analytics-choice'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
 metadataBase: new URL(siteUrl), ...publicPageMetadata('/'),
 icons: {
  icon: { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
  shortcut: '/favicon.ico',
  apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
 },
}
const structuredData = { '@context': 'https://schema.org', '@graph': [
 { '@type': 'Organization', '@id': siteUrl + '/#organization', name: 'Cozy Health', url: siteUrl, logo: siteUrl + '/logo.png' },
 { '@type': 'WebSite', '@id': siteUrl + '/#website', name: 'Cozy Health', url: siteUrl, publisher: { '@id': siteUrl + '/#organization' } },
] }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\u003c') }} />
        <AnalyticsChoice />
      </body>
    </html>
  )
}
