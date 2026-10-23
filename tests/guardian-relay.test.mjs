import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

test('retired guardian relay never contacts API and clears old session credentials', async () => {
 const source = fs.readFileSync(new URL('../app/api/guardian/[action]/route.ts', import.meta.url), 'utf8')
 const context = { exports: {}, require, fetch: () => { throw Error('Unexpected network request') } }
 vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context)
 const response = await context.exports.POST()
 assert.equal(response.status, 410)
 assert.equal((await response.json()).code, 'age_flow_retired')
 assert.equal(response.headers.get('Cache-Control'), 'no-store')
 for (const name of ['cozy-guardian','__Host-cozy-guardian']) assert.equal(response.cookies.get(name)?.value, '')
 assert.match(response.headers.get('set-cookie'), /Max-Age=0/)
})
