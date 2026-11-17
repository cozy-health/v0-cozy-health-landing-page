import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import vm from 'node:vm'
function context(path = '/', hostname = 'dev.cozyhealth.org', environment = {}) {
  const captured = [], storage = new Map()
  const code = ts.transpileModule(fs.readFileSync(new URL('../lib/analytics.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const runtime = { exports: {}, process: { env: { NEXT_PUBLIC_POSTHOG_KEY: 'test-key', NEXT_PUBLIC_POSTHOG_HOST: 'https://us.i.posthog.com', ...environment } }, localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key,value), removeItem: key => storage.delete(key) }, crypto: { randomUUID: () => 'pseudonymous-test-id' }, location: { pathname: path, hostname }, AbortController, fetch: async (url, options) => { captured.push({ url, ...options }); return {} } }
  vm.runInNewContext(code, runtime)
  return { api: runtime.exports, captured, storage }
}
test('analytics sends nothing before consent or on sensitive support pages', async () => {
  const first = context(); await first.api.trackWebsite('website_active'); assert.equal(first.captured.length, 0)
  const support = context('/support'); support.api.setAnalyticsChoice(true); await support.api.trackWebsite('website_active'); assert.equal(support.captured.length, 0)
  const guardian = context('/guardian-authorization'); guardian.api.setAnalyticsChoice(true); await guardian.api.trackWebsite('website_active'); assert.equal(guardian.captured.length, 0)
})
test('only selected events are sent and withdrawal deletes identity', async () => {
  const { api, captured, storage } = context(); api.setAnalyticsChoice(true)
  await api.trackWebsite('crisis_opened'); assert.equal(captured.length, 0)
  await api.trackWebsite('website_active'); assert.equal(captured.length, 1)
  const payload = JSON.parse(captured[0].body)
  assert.deepEqual(Object.keys(payload.properties).sort(), ['$geoip_disable','$process_person_profile','distinct_id','environment','platform'])
  assert.equal(payload.properties.environment, 'development')
  assert.equal(captured[0].url, 'https://us.i.posthog.com/i/v0/e/')
  assert.equal(captured[0].credentials, 'omit')
  api.setAnalyticsChoice(false); assert.equal(storage.has('cozy-analytics-id'), false)
  await api.trackWebsite('website_active'); assert.equal(captured.length, 1)
})
test('development telemetry cannot run on production or an unrelated origin', async () => {
  for (const hostname of ['cozyhealth.org', 'dashboard-dev.cozyhealth.org', 'dev.cozyhealth.org.attacker.example']) {
    const { api, captured } = context('/', hostname)
    api.setAnalyticsChoice(true)
    await api.trackWebsite('website_active')
    assert.equal(captured.length, 0)
  }
})

test('production telemetry requires explicit activation and retains consent and route boundaries', async () => {
  const enabled = { NEXT_PUBLIC_TELEMETRY_ENVIRONMENT: 'production', NEXT_PUBLIC_TELEMETRY_ENABLED: 'true' }
  const site = context('/', 'cozyhealth.org', enabled)
  await site.api.trackWebsite('website_active')
  assert.equal(site.captured.length, 0)
  site.api.setAnalyticsChoice(true)
  await site.api.trackWebsite('website_active')
  assert.equal(site.captured.length, 1)
  assert.equal(JSON.parse(site.captured[0].body).properties.environment, 'production')
  site.api.setAnalyticsChoice(false)
  await site.api.trackWebsite('website_active')
  assert.equal(site.captured.length, 1)
  for (const [pathname, hostname, settings] of [
    ['/support', 'cozyhealth.org', enabled],
    ['/', 'dev.cozyhealth.org', enabled],
    ['/', 'cozyhealth.org.attacker.example', enabled],
    ['/', 'cozyhealth.org', { ...enabled, NEXT_PUBLIC_TELEMETRY_ENABLED: 'false' }],
    ['/', 'cozyhealth.org', { ...enabled, NEXT_PUBLIC_TELEMETRY_ENVIRONMENT: 'unknown' }],
  ]) {
    const instance = context(pathname, hostname, settings)
    instance.api.setAnalyticsChoice(true)
    await instance.api.trackWebsite('website_active')
    assert.equal(instance.captured.length, 0)
  }
})
