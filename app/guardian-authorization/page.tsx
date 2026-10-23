import type { Metadata } from 'next'
import { GuardianAuthorization } from '@/components/guardian-authorization'

export const metadata: Metadata = { title: 'Guardian authorization | Cozy Health', robots: { index: false, follow: false }, referrer: 'no-referrer' }
export default function Page() { return <GuardianAuthorization /> }
