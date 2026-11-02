import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const source = fs.readFileSync(new URL('../components/waitlist-form.tsx', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText
const nodes = node => Array.isArray(node) ? node.flatMap(nodes) : node && typeof node === 'object' ? [node, ...nodes(node.props?.children)] : []

function harness(checked, responses = [true]) {
  let status = 'idle'
  let resets = 0
  const requests = []
  const form = { checked, reset() { resets++; this.checked = false } }
  const jsx = (type, props) => ({ type, props })
  const context = {
    exports: {},
    require: () => ({ jsx, jsxs: jsx, useState: () => [status, value => { status = value }] }),
    FormData: class extends FormData {
      constructor(currentForm) {
        super()
        this.set('name', 'Test Person')
        this.set('email', 'test@example.com')
        if (currentForm.checked) this.append('is_provider', 'Yes')
      }
    },
    fetch: async (url, options) => {
      requests.push({ url, ...options })
      return { ok: responses.shift() }
    },
  }
  vm.runInNewContext(compiled, context)
  const render = () => context.exports.WaitlistForm()
  const submit = () => render().props.onSubmit({ preventDefault() {}, currentTarget: form })
  return { render, submit, requests, form, get status() { return status }, get resets() { return resets } }
}

test('provider checkbox is optional, unchecked by default, and associated with its label', () => {
  const all = nodes(harness(false).render())
  const checkbox = all.find(node => node.type === 'input' && node.props.type === 'checkbox')
  assert.ok(checkbox)
  assert.equal(checkbox.props.name, 'is_provider')
  assert.equal(checkbox.props.value, 'Yes')
  assert.ok(!checkbox.props.required && !checkbox.props.checked && !checkbox.props.defaultChecked)
  const label = all.find(node => node.type === 'label' && node.props.htmlFor === checkbox.props.id)
  assert.ok(label)
  assert.match(JSON.stringify(label.props.children), /I am a healthcare provider/)
})

for (const checked of [false, true]) {
  test(`waitlist submission sends explicit provider ${checked ? 'Yes' : 'No'}`, async () => {
    const h = harness(checked)
    await h.submit()
    const request = h.requests[0]
    assert.equal(request.url, 'https://formspree.io/f/xjyvwkpj')
    assert.equal(request.method, 'POST')
    assert.equal(request.body.get('name'), 'Test Person')
    assert.equal(request.body.get('email'), 'test@example.com')
    assert.deepEqual(request.body.getAll('is_provider'), [checked ? 'Yes' : 'No'])
    assert.equal(h.status, 'success')
    assert.equal(h.resets, 1)
    assert.equal(h.render().props.role, 'status')
  })
}

test('failed submission preserves provider choice for retry and disables submit while pending', async () => {
  const h = harness(true, [false, true])
  const submission = h.submit()
  assert.equal(h.status, 'pending')
  assert.ok(nodes(h.render()).some(node => node.props.type === 'submit' && node.props.disabled))
  await submission
  assert.equal(h.status, 'error')
  assert.equal(h.resets, 0)
  assert.equal(h.form.checked, true)
  assert.ok(nodes(h.render()).some(node => node.props.role === 'alert'))
  await h.submit()
  assert.equal(h.requests[1].body.get('is_provider'), 'Yes')
  assert.equal(h.status, 'success')
})
