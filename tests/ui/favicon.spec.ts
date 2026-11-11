import { test, expect } from '@playwright/test'
import { createHash } from 'node:crypto'
import icons from '../fixtures/cozy-icons.json'

test('favicon declarations and legacy icon URLs serve the approved Cozy artwork', async ({ page, request }) => {
  await page.goto('/')
  for (const [rel, path, size] of [
    ['icon', '/favicon-96x96.png', '96x96'],
    ['apple-touch-icon', '/apple-touch-icon.png', '180x180'],
    ['shortcut icon', '/favicon.ico', ''],
  ]) {
    if (!rel || !path) throw new Error('Missing icon expectation')
    const link = page.locator(`link[rel="${rel}"]`)
    await expect(link).toHaveCount(1)
    const href = await link.getAttribute('href')
    expect(new URL(href ?? '', page.url()).pathname).toBe(path)
    if (size) await expect(link).toHaveAttribute('sizes', size)
  }
  for (const icon of icons) {
    const response = await request.get(icon.path)
    expect(response.status(), icon.path).toBe(200)
    const body = await response.body()
    const artwork = icon.path.endsWith('.svg') ? Buffer.from(body.toString().replace(/\r\n/g, '\n')) : body
    expect(createHash('sha256').update(artwork).digest('hex'), icon.path).toBe(icon.sha256)
    if ('size' in icon) {
      expect(response.headers()['content-type']).toContain('image/png')
      expect(body.readUInt32BE(16)).toBe(icon.size)
      expect(body.readUInt32BE(20)).toBe(icon.size)
    } else if (icon.path.endsWith('.ico')) {
      expect(body.readUInt16LE(0)).toBe(0)
      expect(body.readUInt16LE(2)).toBe(1)
      expect(body.readUInt16LE(4)).toBe(4)
    } else {
      expect(response.headers()['content-type']).toContain('image/svg+xml')
      expect(body.toString()).toContain('data:image/png;base64,')
    }
  }
})
