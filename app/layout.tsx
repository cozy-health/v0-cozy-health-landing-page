import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AnalyticsChoice } from '@/components/analytics-choice'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.COZY_DEPLOYMENT_ENV === 'production' ? 'https://cozyhealth.org' : 'https://dev.cozyhealth.org'),
  title: 'Cozy Health | Mental Health Care That Stays With You',
  description: 'Continuous mental health care before, between, and after sessions. Cozy bridges patients and providers with self-care tools, mood tracking, and personal insights.',
  icons: {
    icon: { url: '/logo.png', type: 'image/png' },
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Cozy Health',
    description: 'Mood tracking, journaling and care you choose to share.',
    images: [{ url: '/logo.png', width: 500, height: 500, alt: 'Cozy Health logo' }],
  },
  twitter: { card: 'summary', images: ['/logo.png'] },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <AnalyticsChoice />
      </body>
    </html>
  )
}
