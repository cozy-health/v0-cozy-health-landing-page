import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

test('old guardian links display retirement without collecting details or using the link', () => {
 const source = fs.readFileSync(new URL('../components/guardian-authorization.tsx', import.meta.url), 'utf8')
 const jsx = (type, props) => ({ type, props })
 const context = { exports: {}, require: () => ({ jsx, jsxs: jsx }), fetch: () => { throw Error('Must not contact API') } }
 vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText, context)
 const tree = context.exports.GuardianAuthorization()
 const nodes = node => Array.isArray(node) ? node.flatMap(nodes) : node && typeof node === 'object' ? [node, ...nodes(node.props?.children)] : []
 const all = nodes(tree)
 assert.equal(all.some(node => ['input', 'form', 'button'].includes(node.type)), false)
 assert.equal(all.find(node => node.type === 'a').props.href, '/')
 assert.match(JSON.stringify(tree), /no longer/)
})
