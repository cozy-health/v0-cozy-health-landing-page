import { test, expect } from '@playwright/test'
import { legalDocuments } from '../../lib/legal/documents'
const production = process.env.PLAYWRIGHT_EXPECT_PRODUCTION === '1'
const origin = production ? 'https://cozyhealth.org' : 'https://dev.cozyhealth.org'
test('SEO endpoints and public metadata match the environment', async ({ request, page }) => {
 const robots = await request.get('/robots.txt')
 expect(robots.status()).toBe(200)
 expect(await robots.text()).toContain('Allow: /')
 expect((await robots.text()).includes('Sitemap:')).toBe(production)
 const sitemap = await request.get('/sitemap.xml')
 expect(sitemap.status()).toBe(200)
 const xml = await sitemap.text()
 const paths = ['/', '/plans', '/waitlist', '/legal', ...legalDocuments.filter(doc => doc.published).map(doc => doc.route)]
 for (const path of paths) expect(xml.includes('<loc>' + origin + path + '</loc>')).toBe(production)
 for (const path of ['/privacy-policy', '/guardians', '/guardian-authorization', '/api/', '/legal/consumer-']) expect(xml).not.toContain('<loc>' + origin + path + '</loc>')
 for (const path of ['/', '/plans', '/waitlist', '/legal']) {
  const response = await page.goto(path)
  expect(response?.status()).toBe(200)
  expect(response?.headers()['x-robots-tag']?.includes('noindex') ?? false).toBe(!production)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', origin + (path === '/' ? '' : path))
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', production ? 'index, follow' : 'noindex, follow')
  await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute('content', /opengraph-image/)
  const data = await page.locator('script[type="application/ld+json"]').textContent()
  expect(JSON.parse(data ?? '{}')['@graph']).toHaveLength(2)
 }
 const image = await request.get('/opengraph-image')
 expect(image.status()).toBe(200)
 expect(image.headers()['content-type']).toContain('image/png')
 const body = await image.body()
 expect(body.readUInt32BE(16)).toBe(1200)
 expect(body.readUInt32BE(20)).toBe(630)
 const missing = await request.get('/not-a-real-cozy-page')
 expect(missing.status()).toBe(404)
 const redirect = await request.get('/privacy-policy', { maxRedirects: 0 })
 expect(redirect.status()).toBe(308)
})

test('public links resolve and navigation timing is recorded', async ({ page, request }, testInfo) => {
 const timings: Record<string, number> = {}
 for (const width of [390, 1280]) {
  await page.setViewportSize({ width, height: 844 })
  await page.goto('/')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  timings[String(width)] = await page.evaluate(() => {
   const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
   return navigation?.domContentLoadedEventEnd ?? 0
  })
 }
 await testInfo.attach('local-navigation-timing.json', { body: JSON.stringify(timings), contentType: 'application/json' })
 const links = await page.locator('a[href^="/"]').evaluateAll(elements => [...new Set(elements.map(element => element.getAttribute('href')?.split('#')[0]).filter((href): href is string => !!href))])
 for (const href of links) expect((await request.get(href)).status(), href).toBeLessThan(400)
 for (const path of ['/guardians', '/guardian-authorization']) {
  await page.goto(path)
  const directives = await page.locator('meta[name="robots"]').evaluateAll(tags => tags.map(tag => tag.getAttribute('content') ?? ''))
  expect(directives.length).toBeGreaterThan(0)
  expect(directives.every(value => value.includes('noindex'))).toBe(true)
 }
})
