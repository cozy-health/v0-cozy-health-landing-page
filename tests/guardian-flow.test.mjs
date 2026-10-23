import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const code = ts.transpileModule(fs.readFileSync(new URL('../components/guardian-authorization.tsx', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
const review = () => ({ completed: false, account_first_name: 'Test', withdrawal: false, documents_ready: true, documents: { tos: { title: 'Terms', version: 'test-1', published: true, content: 'Synthetic terms.' } }, versions: { tos: 'test-1' }, expires_at: new Date(Date.now() + 1200000).toISOString() })

// Exercise the real component's handlers/effects with deterministic hooks and
// transport. Relay security and API state transitions have separate tests.
function page(handler, hash = '') {
  const slots = [], effects = new Map(), timers = new Map(), calls = []
  let cursor = 0, tree, timerId = 0, now = Date.now()
  const react = {
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value }] },
    useRef(initial) { const i = cursor++; if (!(i in slots)) slots[i] = { current: initial }; return slots[i] },
    useEffect(fn, deps) { const i = cursor++, previous = effects.get(i); if (!previous || deps.some((value, index) => value !== previous.deps[index])) effects.set(i, { fn, deps, pending: true, cleanup: previous?.cleanup }) },
  }
  const jsx = (type, props) => ({ type, props })
  const location = { hash, pathname: '/guardian-authorization' }
  const context = { exports: {}, require: name => name === 'react' ? react : { jsx, jsxs: jsx, Fragment: 'fragment' }, Error, TypeError, Number, AbortSignal,
    Date: { parse: Date.parse, now: () => now },
    setTimeout: (fn, delay) => { const id = ++timerId; timers.set(id, { fn, at: now + delay }); return id }, clearTimeout: id => timers.delete(id),
    window: { location, history: { replaceState: () => { location.hash = '' } } },
    fetch: async (url, options) => { const action = url.split('/').at(-1), body = JSON.parse(options.body); calls.push({ action, body }); const result = await handler(action, body); return result instanceof Response ? result : new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } }) },
  }
  vm.runInNewContext(code, context)
  function render() { cursor = 0; tree = context.exports.GuardianAuthorization(); for (const effect of effects.values()) if (effect.pending) { effect.pending = false; effect.cleanup?.(); effect.cleanup = effect.fn() } return tree }
  function nodes(node) { if (Array.isArray(node)) return node.flatMap(item => nodes(item)); if (!node || typeof node !== 'object') return []; return [node, ...nodes(node.props?.children)] }
  function text(node) { if (Array.isArray(node)) return node.map(text).join(''); return typeof node === 'string' || typeof node === 'number' ? String(node) : node && typeof node === 'object' ? text(node.props?.children) : '' }
  async function flush() { await new Promise(resolve => setImmediate(resolve)); render(); await new Promise(resolve => setImmediate(resolve)); render() }
  render()
  return { calls, flush, render, nodes: () => nodes(tree), text: () => text(tree), button: label => nodes(tree).find(node => node.type === 'button' && text(node) === label),
    checkbox: () => nodes(tree).find(node => node.type === 'input' && node.props.type === 'checkbox'),
    replayMountEffects() { for (const effect of effects.values()) if (effect.deps.length === 0) { effect.cleanup?.(); effect.cleanup = effect.fn() } },
    expire() { now += 1260000; for (const [id, timer] of timers) if (timer.at <= now) { timers.delete(id); timer.fn() } render() },
  }
}

test('confirmation is explicit, prepares recovery first, and still requires a separate decision', async () => {
  const screen = page(async action => action === 'prepare' ? { ready: true } : action === 'decision' ? { message: 'Recorded.' } : review(), '#' + 'a'.repeat(64))
  await screen.flush()
  screen.replayMountEffects(); await screen.flush()
  assert.equal(screen.calls.length, 0)
  await screen.button('Confirm email and review request').props.onClick(); await screen.flush()
  assert.deepEqual(screen.calls.map(call => call.action), ['prepare', 'confirm'])
  assert.equal(screen.button('Authorize').props.disabled, true)
  screen.checkbox().props.onChange({ target: { checked: true } }); screen.render()
  assert.equal(screen.button('Authorize').props.disabled, false)
  await screen.button('Authorize').props.onClick(); await screen.flush()
  assert.match(screen.text(), /Recorded/)
})

test('lost confirmation response recovers the review and reload restores it without granting consent', async () => {
  const transport = async action => { if (action === 'confirm') throw new TypeError('Lost confirmation response'); return action === 'prepare' ? { ready: true } : review() }
  const screen = page(transport, '#' + 'b'.repeat(64)); await screen.flush()
  await screen.button('Confirm email and review request').props.onClick(); await screen.flush()
  assert.deepEqual(screen.calls.map(call => call.action), ['prepare', 'confirm', 'review'])
  assert.match(screen.text(), /Request for Test/)
  assert.equal(screen.checkbox().props.checked, false)
  const reloaded = page(transport); await reloaded.flush()
  assert.deepEqual(reloaded.calls.map(call => call.action), ['review'])
  assert.equal(reloaded.checkbox().props.checked, false)
})

test('a lost decision response restores only the saved receipt and never resubmits', async () => {
  let decided = false
  const screen = page(async action => {
    if (action === 'prepare') return { ready: true }
    if (action === 'decision') { decided = true; throw new TypeError('Lost decision response') }
    return decided ? { completed: true, decision: 'authorized', message: 'Authorization recorded.' } : review()
  }, '#' + 'c'.repeat(64))
  await screen.flush(); await screen.button('Confirm email and review request').props.onClick(); await screen.flush()
  screen.checkbox().props.onChange({ target: { checked: true } }); screen.render()
  await screen.button('Authorize').props.onClick(); await screen.flush()
  assert.match(screen.text(), /Authorization recorded/)
  assert.equal(screen.calls.filter(call => call.action === 'decision').length, 1)
  assert.equal(screen.button('Authorize'), undefined)
})

test('an unsaved decision restores review with the checkbox reset and an honest error', async () => {
  const screen = page(async action => action === 'decision' ? new Response(JSON.stringify({ message: 'Your decision was not confirmed.' }), { status: 503 }) : action === 'prepare' ? { ready: true } : review(), '#' + 'd'.repeat(64))
  await screen.flush(); await screen.button('Confirm email and review request').props.onClick(); await screen.flush()
  screen.checkbox().props.onChange({ target: { checked: true } }); screen.render()
  await screen.button('Authorize').props.onClick(); await screen.flush()
  assert.match(screen.text(), /not confirmed/)
  assert.equal(screen.checkbox().props.checked, false)
  assert.equal(screen.button('Authorize').props.disabled, true)
})

test('expired or absent reviews offer new-link recovery and withdrawal remains available', async () => {
  const absent = page(async () => new Response(JSON.stringify({ message: 'This review has expired.' }), { status: 410 })); await absent.flush()
  assert.match(absent.text(), /Reopen the link in your email/)
  assert.ok(absent.button('Email me a withdrawal link'))
  const active = page(async () => review()); await active.flush(); active.expire()
  assert.equal(active.button('Authorize').props.disabled, true)
  assert.ok(active.button('Email me a withdrawal link'))
  assert.match(active.text(), /review has expired/)
})
