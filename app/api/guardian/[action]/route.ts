import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'node:crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const cookie = process.env.NODE_ENV === 'production' ? '__Host-cozy-guardian' : 'cozy-guardian'
const headers = { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' }
const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, path: '/' }

export async function POST(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  const { action } = await context.params
  if (!['prepare', 'confirm', 'review', 'decision', 'withdrawal'].includes(action)) return NextResponse.json({ message: 'Not found.' }, { status: 404, headers })
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
    if (action === 'prepare') {
      const response = NextResponse.json({ ready: true }, { headers })
      response.cookies.set(cookie, randomBytes(32).toString('hex'), { ...options, maxAge: 1200 })
      return response
    }
    const credential = request.cookies.get(cookie)?.value ?? ''
    if (['confirm', 'review', 'decision'].includes(action) && !/^[a-f0-9]{64}$/.test(credential)) {
      return NextResponse.json({ message: 'This review is unavailable or has expired. Reopen your email link or request a new one.' }, { status: 410, headers })
    }
    const data = { ...body, ...(['confirm', 'review', 'decision'].includes(action) ? { session: credential } : {}) }
    const upstream = await fetch(new URL(action, target), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data), cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(20000) })
    const result: Record<string, unknown> = await upstream.json()
    delete result.session
    if (!upstream.ok) {
      const messages: Record<number, string> = {
        404: 'This email link has already been used or replaced. Restore your review, or ask for a new invitation.',
        410: 'This review or email link has expired. Ask the young person for a new invitation, or request a fresh withdrawal link below.',
        422: 'Check the email address and required choices, then try again.',
        429: 'Too many attempts. Please wait before trying again.',
      }
      // Do not render upstream debug/exception text in the public guardian flow.
      for (const key of Object.keys(result)) delete result[key]
      result.message = messages[upstream.status] ?? (upstream.status >= 500
        ? action === 'withdrawal' ? 'The email request was not confirmed. Check your inbox before requesting another link.' : 'The authorization service is unavailable. Your decision has not been confirmed; restore the review before retrying.'
        : 'The request could not be completed. Restore the review to check its current status.')
    }
    const response = NextResponse.json(result, { status: upstream.status, headers })
    const retry = upstream.headers.get('retry-after')
    if (upstream.status === 429 && retry && /^\d{1,6}$/.test(retry)) response.headers.set('Retry-After', retry)
    // Review/decision never extend the original 20-minute cookie lifetime.
    // Keep it after a decision so a lost response can recover a read-only receipt.
    if (action === 'review' && [404, 410].includes(upstream.status)) response.cookies.set(cookie, '', { ...options, maxAge: 0 })
    return response
  } catch {
    return NextResponse.json({ message: 'The authorization service is unavailable. Please retry.' }, { status: 503, headers })
  }
}
