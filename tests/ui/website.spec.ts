import { test, expect, type Page } from '@playwright/test'
import { resolve } from 'node:path'

declare global {
  interface Window { axe: typeof import('axe-core') }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('ui-choice-seeded')) {
      localStorage.setItem('cozy-analytics-choice', 'no')
      sessionStorage.setItem('ui-choice-seeded', 'yes')
    }
  })
  await page.route(/https:\/\/(?:us|eu)\.i\.posthog\.com\//, route => route.fulfill({ status: 200, body: '{}' }))
  await page.route('https://formspree.io/**', route => route.abort())
})

async function noPageOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
}

// 640x450 is the CSS viewport equivalent of a 1280x900 window at 200% zoom.
for (const [width, height] of [[320, 740], [390, 844], [640, 450], [768, 1024], [1024, 768], [1280, 900], [1440, 900], [844, 390]]) {
  test(`landing reflows at ${width}x${height}`, async ({ page }) => {
    if (width === undefined || height === undefined) throw new Error('Viewport dimensions missing')
    await page.setViewportSize({ width, height })
    await page.goto('/')
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('contentinfo')).toHaveCount(1)
    await expect(page.getByRole('main')).toHaveCount(1)
    await noPageOverflow(page)
    const label = page.getByText('Proactive', { exact: true })
    expect(await label.evaluate(el => {
      const range = document.createRange(); range.selectNodeContents(el)
      const text = range.getBoundingClientRect(); const box = el.getBoundingClientRect()
      return text.right <= box.right + 1 && text.right <= innerWidth
    })).toBe(true)
    expect(await page.getByRole('button', { name: 'Privacy choices', exact: true }).evaluate(el => getComputedStyle(el).position)).not.toBe('fixed')
    await expect(page.getByRole('list', { name: 'Continuous care steps' }).getByRole('listitem')).toHaveCount(3)
  })
}

test('header adapts to enlarged text without overlapping navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' })
  const toggle = page.getByRole('button', { name: 'Toggle menu' })
  await expect(toggle).toBeVisible()
  await noPageOverflow(page)
  expect(await page.getByRole('link', { name: 'Cozy Health home' }).evaluate(el => el.getBoundingClientRect().right)).toBeLessThan(await toggle.evaluate(el => el.getBoundingClientRect().left))
})

test('brand backgrounds and approved accessible text colours are preserved', async ({ page }, testInfo) => {
  await page.goto('/')
  await expect(page.locator('#providers')).toHaveCSS('background-color', 'rgb(242, 92, 5)')
  await expect(page.locator('#providers h2')).toHaveCSS('color', 'rgb(59, 22, 2)')
  await expect(page.locator('#providers h2 span')).toHaveCSS('color', 'rgb(59, 22, 2)')
  await expect(page.getByText('Proactive', { exact: true })).toHaveCSS('color', 'rgb(154, 59, 0)')
  await expect(page.getByText('Real-time', { exact: true })).toHaveCSS('color', 'rgb(0, 110, 44)')
  await expect(page.locator('#impact h2 span')).toHaveCSS('color', 'rgb(154, 59, 0)')
  const partner = page.getByRole('link', { name: 'Partner With Us' })
  await partner.hover()
  await expect(partner).toHaveCSS('color', 'rgb(154, 59, 0)')
  await partner.focus()
  await expect(partner).toBeFocused()
  await expect(partner).toHaveCSS('color', 'rgb(154, 59, 0)')
  await page.locator('#providers').screenshot({ path: testInfo.outputPath('provider-contrast.png') })
  const pixel = await page.locator('#providers .backdrop-blur-sm.rounded-3xl').evaluate(el => {
    const canvas = document.createElement('canvas'); canvas.width = 1; canvas.height = 1
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas unavailable for color verification')
    context.fillStyle = getComputedStyle(el).backgroundColor
    context.fillRect(0, 0, 1, 1)
    return [...context.getImageData(0, 0, 1, 1).data]
  })
  expect(pixel.slice(0, 3)).toEqual([255, 255, 255])
  const alpha = pixel[3]
  if (alpha === undefined) throw new Error('Missing preview alpha')
  expect(Math.abs(alpha - 25.5)).toBeLessThanOrEqual(0.5)
})

test('mobile navigation supports Escape, short screens, anchors and correct login environment', async ({ page }) => {
  await page.setViewportSize({ width: 568, height: 320 })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Toggle menu' })
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  const navigation = page.getByRole('navigation', { name: 'Main navigation' })
  const expectedHost = process.env.PLAYWRIGHT_EXPECT_PRODUCTION === '1' ? 'dashboard.cozyhealth.org' : 'dashboard-dev.cozyhealth.org'
  await expect(navigation.getByRole('link', { name: 'Provider Log In' })).toHaveAttribute('href', `https://${expectedHost}/login`)
  await navigation.getByRole('link', { name: 'Get Started' }).scrollIntoViewIfNeeded()
  await expect(navigation.getByRole('link', { name: 'Get Started' })).toBeInViewport()
  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toBeFocused()
  await toggle.click()
  await page.locator('#mobile-navigation').getByRole('link', { name: 'For Providers', exact: true }).click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(page).toHaveURL(/#providers$/)
  await expect.poll(async () => page.locator('#providers h2').evaluate(el => el.getBoundingClientRect().top >= (document.querySelector('header')?.getBoundingClientRect().bottom ?? 0))).toBe(true)
})

test('privacy preferences persist and reopen with focus without covering page copy', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.removeItem('cozy-analytics-choice'))
  await page.reload()
  const panel = page.getByRole('region', { name: 'Help us improve Cozy Health?' })
  await expect(panel).toBeVisible()
  await panel.getByRole('button', { name: 'Decline analytics', exact: true }).click()
  await page.reload()
  await expect(panel).toHaveCount(0)
  const trigger = page.getByRole('button', { name: 'Privacy choices', exact: true })
  await trigger.click()
  await expect(panel.getByRole('heading')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(panel).toHaveCount(0)
  await trigger.click()
  await panel.getByRole('button', { name: 'Allow analytics', exact: true }).click()
  await expect.poll(() => page.evaluate(() => localStorage.getItem('cozy-analytics-choice'))).toBe('yes')
  await trigger.click()
  await panel.getByRole('button', { name: 'Decline analytics', exact: true }).click()
  await expect.poll(() => page.evaluate(() => localStorage.getItem('cozy-analytics-choice'))).toBe('no')
  await page.setViewportSize({ width: 320, height: 260 })
  await trigger.click()
  await panel.getByRole('button', { name: 'Allow analytics', exact: true }).scrollIntoViewIfNeeded()
  await expect(panel.getByRole('button', { name: 'Allow analytics', exact: true })).toBeInViewport()
  expect(await panel.evaluate(el => el.getBoundingClientRect().height)).toBeLessThanOrEqual(260)
  await page.goto('/guardian-authorization')
  await expect(trigger).toHaveCount(0)
})

for (const route of ['/', '/plans', '/waitlist', '/legal']) {
  test(`page semantics and accessible brand contrast ${route}`, async ({ page }, testInfo) => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(route)
      await page.addScriptTag({ path: resolve('node_modules/axe-core/axe.min.js') })
      const violations = await page.evaluate(async () => {
        const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] } })
        return result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ html: n.html, summary: n.failureSummary })) }))
      })
      await testInfo.attach(`accessibility-findings-${width}`, { body: JSON.stringify(violations, null, 2), contentType: 'application/json' })
      expect(violations, `${route} at ${width}px`).toEqual([])
    }
  })
}

test('mobile policy sections and comparison table are keyboard reachable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/privacy')
  const summary = page.locator('summary').filter({ hasText: 'On this page' })
  await summary.focus()
  await page.keyboard.press('Enter')
  const sections = page.getByRole('navigation', { name: 'Document sections' })
  const first = sections.getByRole('link').first()
  await expect(first).toBeVisible()
  await first.click()
  await expect(page).toHaveURL(/#section-1$/)
  await page.goto('/plans')
  const table = page.getByRole('region', { name: 'Plan feature comparison' })
  await table.focus()
  await expect(table).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect.poll(() => table.evaluate(el => el.scrollLeft)).toBeGreaterThan(0)
})

for (const provider of [false, true]) {
  test(`waitlist sends provider ${provider ? 'Yes' : 'No'} and preserves retry state`, async ({ page }) => {
    const values: string[] = []
    let fail = true
    await page.route('https://formspree.io/**', async route => {
      const payload = route.request().postData() ?? ''
      const matches = [...payload.matchAll(/name="is_provider"\r\n\r\n([^\r\n]*)/g)]
      expect(matches).toHaveLength(1)
      const value = matches[0]?.[1]
      if (value === undefined) throw new Error('Provider field missing')
      values.push(value)
      await route.fulfill({ status: fail ? 500 : 200, contentType: 'application/json', body: '{}' })
      fail = false
    })
    await page.goto('/waitlist')
    await page.getByLabel('Name', { exact: true }).fill('UI Test')
    await page.getByLabel('Email address', { exact: true }).fill('ui-test@example.com')
    const checkbox = page.getByRole('checkbox', { name: 'I am a healthcare provider' })
    await expect(checkbox).not.toBeChecked()
    if (provider) await page.getByText('I am a healthcare provider', { exact: true }).click()
    await page.getByRole('button', { name: 'Join the Waitlist' }).click()
    await expect(page.getByRole('alert').filter({ hasText: 'Something went wrong' })).toBeVisible()
    await expect(checkbox).toBeChecked({ checked: provider })
    await page.getByRole('button', { name: 'Join the Waitlist' }).click()
    await expect(page.getByRole('status').filter({ hasText: "You're on the list!" })).toBeVisible()
    expect(values).toEqual([provider ? 'Yes' : 'No', provider ? 'Yes' : 'No'])
  })
}
