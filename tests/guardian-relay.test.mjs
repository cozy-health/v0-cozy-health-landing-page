import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { NextRequest } = require('next/server')
const source = fs.readFileSync(new URL('../app/api/guardian/[action]/route.ts', import.meta.url), 'utf8')
function runtime(result = { session: 'a'.repeat(64), account_first_name: 'Test' }, status = 200) {
  const captured = []
  const context = { exports: {}, require, process: { env: { NODE_ENV: 'production', GUARDIAN_SITE_ORIGIN: 'https://cozy.test', GUARDIAN_API_URL: 'https://api.cozy.test/api/v1/guardian/' } }, URL, Buffer, AbortSignal,
    fetch: async (url, options) => { captured.push({ url: url.toString(), ...options }); return new Response(JSON.stringify(result), { status, headers: { 'Content-Type': 'application/json' } }) } }
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context)
  return { post: context.exports.POST, captured }
}
function request(action, body, headers = {}) {
  return new NextRequest(`https://cozy.test/api/guardian/${action}`, { method: 'POST', headers: { origin: 'https://cozy.test', 'content-type': 'application/json', 'x-cozy-request': '1', ...headers }, body: JSON.stringify(body) })
}
const params = action => ({ params: Promise.resolve({ action }) })

test('confirmation keeps guardian session in a secure HTTP-only cookie and out of JSON', async () => {
  const { post, captured } = runtime()
  const response = await post(request('confirm', { token: 'b'.repeat(64) }), params('confirm'))
  assert.equal(response.status, 200)
  assert.equal((await response.json()).session, undefined)
  const cookie = response.headers.get('set-cookie')
  assert.match(cookie, /__Host-cozy-guardian=/)
  for (const flag of [/HttpOnly/i, /Secure/i, /SameSite=strict/i, /Max-Age=1200/]) assert.match(cookie, flag)
  assert.equal(captured[0].redirect, 'error')
  assert.equal(captured[0].cache, 'no-store')
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer')
})
test('decision uses only the HTTP-only session and clears it after success', async () => {
  const { post, captured } = runtime({ message: 'Recorded.' })
  const response = await post(request('decision', { decision: 'authorize', session: 'forged' }, { cookie: '__Host-cozy-guardian=' + 'c'.repeat(64) }), params('decision'))
  assert.equal(JSON.parse(captured[0].body).session, 'c'.repeat(64))
  assert.match(response.headers.get('set-cookie'), /Max-Age=0/)
})
test('cross-origin requests unknown actions and oversized payloads never reach the API', async () => {
  const { post, captured } = runtime()
  assert.equal((await post(request('confirm', {}, { origin: 'https://attacker.test' }), params('confirm'))).status, 403)
  assert.equal((await post(request('arbitrary', {}), params('arbitrary'))).status, 404)
  assert.equal((await post(request('confirm', { token: 'a'.repeat(9000) }), params('confirm'))).status, 413)
  assert.equal(captured.length, 0)
})
test('an expired link does not create a session cookie', async () => {
  const { post } = runtime({ message: 'Expired.' }, 410)
  const response = await post(request('confirm', { token: 'b'.repeat(64) }), params('confirm'))
  assert.equal(response.status, 410)
  assert.equal(response.headers.get('set-cookie'), null)
})
