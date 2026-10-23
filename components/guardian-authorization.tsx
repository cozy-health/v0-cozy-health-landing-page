'use client'

import { useEffect, useRef, useState } from 'react'

type Document = { title: string; version: string; content: string | null; published: boolean }
type Review = { account_first_name: string; withdrawal: boolean; documents_ready: boolean; documents: Record<string, Document>; versions: Record<string, string> }

function isRecord(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === 'object' && !Array.isArray(value) }
function parseReview(input: unknown): Review {
  if (!isRecord(input) || typeof input.account_first_name !== 'string' || typeof input.withdrawal !== 'boolean' || typeof input.documents_ready !== 'boolean' || !isRecord(input.documents) || !isRecord(input.versions)) throw Error('The request could not be loaded. Ask for a new invitation.')
  const documents: Record<string, Document> = {}, versions: Record<string, string> = {}
  for (const [key, doc] of Object.entries(input.documents)) {
    if (!isRecord(doc) || typeof doc.title !== 'string' || typeof doc.version !== 'string' || (typeof doc.content !== 'string' && doc.content !== null) || typeof doc.published !== 'boolean') throw Error('The current documents could not be loaded.')
    documents[key] = { title: doc.title, version: doc.version, content: doc.content, published: doc.published }
  }
  for (const [key, version] of Object.entries(input.versions)) { if (typeof version !== 'string') throw Error('The current versions could not be loaded.'); versions[key] = version }
  return { account_first_name: input.account_first_name, withdrawal: input.withdrawal, documents_ready: input.documents_ready, documents, versions }
}

async function send(action: string, body: object): Promise<unknown> {
  const response = await fetch(`/api/guardian/${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Cozy-Request': '1' }, body: JSON.stringify(body), cache: 'no-store', credentials: 'same-origin', referrerPolicy: 'no-referrer' })
  const data: unknown = await response.json()
  if (!response.ok) throw Error(data && typeof data === 'object' && 'message' in data && typeof data.message === 'string' ? data.message : 'Please retry the request.')
  return data
}

export function GuardianAuthorization() {
  const token = useRef('')
  const [hasLink, setHasLink] = useState(false)
  const [review, setReview] = useState<Review | null>(null)
  const [email, setEmail] = useState('')
  const [authority, setAuthority] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    token.current = window.location.hash.slice(1)
    setHasLink(/^[a-f0-9]{64}$/.test(token.current))
    window.history.replaceState(null, '', window.location.pathname)
  }, [])
  async function run(action: () => Promise<void>) {
    if (busy) return
    setBusy(true); setError('')
    try { await action() } catch (err) { setError(err instanceof Error ? err.message : 'Please retry.') } finally { setBusy(false) }
  }
  async function decide(decision: 'authorize' | 'decline' | 'not_guardian' | 'withdraw') {
    await run(async () => {
      const result = await send('decision', { decision, adult_and_authority: authority, versions: review?.versions })
      setReview(null); setHasLink(false)
      setMessage(result && typeof result === 'object' && 'message' in result && typeof result.message === 'string' ? result.message : 'Your decision was recorded.')
    })
  }
  const button = 'min-h-12 rounded-xl border px-5 py-3 text-left disabled:opacity-50'
  return <main className="min-h-screen bg-background px-5 py-12 text-foreground sm:py-20"><div className="mx-auto max-w-2xl space-y-7">
    <a href="/" className="font-semibold text-[#0460d8]">Cozy Health</a>
    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">A thoughtful choice for their wellbeing.</h1>
    <p className="leading-7 text-muted-foreground">Parent or legal guardian authorization lets a young person request access to Cozy Health. It does not give you access to their private journals, messages or assessment results.</p>
    {error && <p role="alert" className="rounded-xl border p-4">{error}</p>}
    {message && <p role="status" className="rounded-xl border p-4">{message}</p>}
    {hasLink && !review && !message && <section className="space-y-4 rounded-2xl border p-6"><h2 className="text-xl font-semibold">Confirm your email</h2><p>Continue only if you control the email address that received this link. This step confirms email access. It does not yet authorize participation.</p><button className={button} disabled={busy} onClick={() => run(async () => { const data = await send('confirm', { token: token.current }); token.current = ''; setReview(parseReview(data)) })}>Confirm email and review request</button></section>}
    {review && <section className="space-y-5 rounded-2xl border p-6"><h2 className="text-xl font-semibold">Request for {review.account_first_name}</h2>
      {review.withdrawal ? <><p>Withdraw your authorization? Future private access will be restricted. Existing records will be preserved securely; withdrawal does not delete the account.</p><button className={button} disabled={busy} onClick={() => decide('withdraw')}>Withdraw authorization</button></> : <>
        <p>Read these documents before deciding. Authorization is separate from the young person’s own choices, provider sharing and any paid subscription.</p>
        {Object.entries(review.documents).map(([key, doc]) => <details key={key} className="rounded-xl border p-4"><summary className="cursor-pointer py-2 font-medium">{doc.title} · {doc.version}</summary><p className="mt-4 whitespace-pre-wrap leading-7">{doc.content}</p></details>)}
        {!review.documents_ready && <p role="status">The required documents are not effective yet. Authorization is unavailable.</p>}
        <label className="flex min-h-12 items-start gap-3"><input type="checkbox" className="mt-1 size-5 shrink-0" checked={authority} onChange={event => setAuthority(event.target.checked)} />I am at least 18, have parental or legal guardian authority for this young person, and authorize the processing described in the documents above. I understand that no private records are shared with me.</label>
        <div className="flex flex-wrap gap-3"><button className={button + ' bg-[#0460d8] text-white'} disabled={busy || !authority || !review.documents_ready} onClick={() => decide('authorize')}>Authorize</button><button className={button} disabled={busy} onClick={() => decide('decline')}>Decline</button><button className={button} disabled={busy} onClick={() => decide('not_guardian')}>I am not their guardian</button></div>
      </>}
    </section>}
    {!review && !hasLink && !message && <p>If your invitation expired, ask the young person to send a new one. No authorization is granted by visiting this page.</p>}
    {!review && <form className="space-y-4 rounded-2xl border p-6" onSubmit={event => { event.preventDefault(); void run(async () => { await send('withdrawal', { email }); setMessage('If an active authorization matches, a confirmation link will be sent.'); setEmail('') }) }}><h2 className="text-xl font-semibold">Withdraw an earlier authorization</h2><label className="block">Your guardian email<input required type="email" maxLength={190} value={email} onChange={event => setEmail(event.target.value)} className="mt-2 block min-h-12 w-full rounded-lg border bg-background p-3" /></label><button disabled={busy} className={button}>Email me a withdrawal link</button></form>}
    <p className="text-sm leading-6">Questions or a disputed request? Contact <a className="underline" href="mailto:Team@cozyhealth.org">Team@cozyhealth.org</a>. Do not email identity documents or private journals. This inbox is not an emergency service.</p>
    <nav className="flex flex-wrap gap-5 text-sm underline"><a href="/guardians">Young people and guardian notice</a><a href="/privacy">Privacy</a><a href="/support">Support</a></nav>
  </div></main>
}
