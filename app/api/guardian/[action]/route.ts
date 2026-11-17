import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ code: 'age_flow_retired', message: 'The custom guardian process has been retired.' }, { status: 410 })
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('Referrer-Policy', 'no-referrer')
  for (const name of ['cozy-guardian', '__Host-cozy-guardian']) {
    response.cookies.set(name, '', { httpOnly: true, secure: name.startsWith('__Host-'), sameSite: 'strict', path: '/', maxAge: 0 })
  }
  return response
}
