import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import vm from 'node:vm'
function context(path = '/') {
  const captured = [], storage = new Map()
  const code = ts.transpileModule(fs.readFileSync(new URL('../lib/analytics.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const runtime = { exports: {}, process: { env: { NEXT_PUBLIC_POSTHOG_KEY: 'test-key', NEXT_PUBLIC_POSTHOG_HOST: 'https://eu.i.posthog.com' } }, localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key,value), removeItem: key => storage.delete(key) }, crypto: { randomUUID: () => 'pseudonymous-test-id' }, location: { pathname: path }, AbortController, fetch: async (url, options) => { captured.push({ url, ...options }); return {} } }
  vm.runInNewContext(code, runtime)
  return { api: runtime.exports, captured, storage }
}
test('analytics sends nothing before consent or on sensitive support pages', async () => {
  const first = context(); await first.api.trackWebsite('website_active'); assert.equal(first.captured.length, 0)
  const support = context('/support'); support.api.setAnalyticsChoice(true); await support.api.trackWebsite('website_active'); assert.equal(support.captured.length, 0)
})
test('only selected events are sent and withdrawal deletes identity', async () => {
  const { api, captured, storage } = context(); api.setAnalyticsChoice(true)
  await api.trackWebsite('crisis_opened'); assert.equal(captured.length, 0)
  await api.trackWebsite('website_active'); assert.equal(captured.length, 1)
  const payload = JSON.parse(captured[0].body)
  assert.deepEqual(Object.keys(payload.properties).sort(), ['$geoip_disable','$process_person_profile','distinct_id','platform'])
  assert.equal(captured[0].credentials, 'omit')
  api.setAnalyticsChoice(false); assert.equal(storage.has('cozy-analytics-id'), false)
  await api.trackWebsite('website_active'); assert.equal(captured.length, 1)
})
