import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const cookie = process.env.NODE_ENV === 'production' ? '__Host-cozy-guardian' : 'cozy-guardian'
const headers = { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' }

export async function POST(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  const { action } = await context.params
  if (!['confirm', 'decision', 'withdrawal'].includes(action)) return NextResponse.json({ message: 'Not found.' }, { status: 404, headers })
  const origin = process.env.GUARDIAN_SITE_ORIGIN || (process.env.NODE_ENV !== 'production' ? request.nextUrl.origin : '')
  if (!origin || request.headers.get('origin') !== origin || request.headers.get('x-cozy-request') !== '1') return NextResponse.json({ message: 'Request origin could not be confirmed.' }, { status: 403, headers })
  try {
    const target = new URL(process.env.GUARDIAN_API_URL || (process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:8000/api/v1/guardian/' : ''))
    if (!target.pathname.endsWith('/api/v1/guardian/') || target.username || target.password || target.search || target.hash || (process.env.NODE_ENV === 'production' && target.protocol !== 'https:')) throw Error('Invalid guardian API configuration')
    if (!request.headers.get('content-type')?.startsWith('application/json')) return NextResponse.json({ message: 'JSON is required.' }, { status: 415, headers })
    const reader = request.body?.getReader(), chunks: Uint8Array[] = []
    let size = 0
    try {
      if (reader) for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        size += value.byteLength
        if (size > 8192) { await reader.cancel(); return NextResponse.json({ message: 'Request too large.' }, { status: 413, headers }) }
        chunks.push(value)
      }
    } finally { reader?.releaseLock() }
    const text = Buffer.concat(chunks).toString('utf8')
    const body: unknown = JSON.parse(text)
    if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ message: 'Invalid request.' }, { status: 400, headers })
    const data = { ...body, ...(action === 'decision' ? { session: request.cookies.get(cookie)?.value ?? '' } : {}) }
    const upstream = await fetch(new URL(action, target), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data), cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(20000) })
    const result: Record<string, unknown> = await upstream.json()
    const session = result.session
    delete result.session
    const response = NextResponse.json(result, { status: upstream.status, headers })
    const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, path: '/' }
    if (action === 'confirm' && upstream.ok && typeof session === 'string' && /^[a-f0-9]{64}$/.test(session)) response.cookies.set(cookie, session, { ...options, maxAge: 1200 })
    if (action === 'decision' && upstream.ok) response.cookies.set(cookie, '', { ...options, maxAge: 0 })
    return response
  } catch {
    return NextResponse.json({ message: 'The authorization service is unavailable. Please retry.' }, { status: 503, headers })
  }
}
