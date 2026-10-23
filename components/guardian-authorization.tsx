'use client'

import { useEffect, useRef, useState } from 'react'

type Document = { title: string; version: string; content: string | null; published: boolean }
type Review = { account_first_name: string; withdrawal: boolean; documents_ready: boolean; documents: Record<string, Document>; versions: Record<string, string>; expires_at: string }

function isRecord(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === 'object' && !Array.isArray(value) }
function parseReview(input: unknown): Review {
  if (!isRecord(input) || typeof input.account_first_name !== 'string' || typeof input.withdrawal !== 'boolean' || typeof input.documents_ready !== 'boolean' || !isRecord(input.documents) || !isRecord(input.versions) || typeof input.expires_at !== 'string' || !Number.isFinite(Date.parse(input.expires_at))) throw Error('The request could not be loaded. Ask for a new invitation.')
  const documents: Record<string, Document> = {}, versions: Record<string, string> = {}
  for (const [key, doc] of Object.entries(input.documents)) {
    if (!isRecord(doc) || typeof doc.title !== 'string' || typeof doc.version !== 'string' || (typeof doc.content !== 'string' && doc.content !== null) || typeof doc.published !== 'boolean') throw Error('The current documents could not be loaded.')
    documents[key] = { title: doc.title, version: doc.version, content: doc.content, published: doc.published }
  }
  for (const [key, version] of Object.entries(input.versions)) { if (typeof version !== 'string') throw Error('The current versions could not be loaded.'); versions[key] = version }
  return { account_first_name: input.account_first_name, withdrawal: input.withdrawal, documents_ready: input.documents_ready, documents, versions, expires_at: input.expires_at }
}

async function send(action: string, body: object): Promise<unknown> {
  try {
    const response = await fetch(`/api/guardian/${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Cozy-Request': '1' }, body: JSON.stringify(body), cache: 'no-store', credentials: 'same-origin', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(25000) })
    const data: unknown = await response.json()
    if (!response.ok) {
      const retry = response.headers.get('retry-after')
      if (response.status === 429 && retry && /^\d{1,6}$/.test(retry)) {
        const minutes = Math.max(1, Math.ceil(Number(retry) / 60))
        throw Error(`Please wait ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} before trying again.`)
      }
      throw Error(isRecord(data) && typeof data.message === 'string' ? data.message : 'The request was not confirmed. Restore your review before retrying.')
    }
    return data
  } catch (err) {
    if (err instanceof TypeError || (err instanceof Error && ['TimeoutError', 'AbortError'].includes(err.name))) throw Error(action === 'withdrawal'
      ? 'The connection was interrupted. Your email is still here. Check your inbox before requesting another link.'
      : 'The connection was interrupted. Restore your review to check what was saved before trying again.')
    throw err
  }
}

export function GuardianAuthorization() {
  const token = useRef('')
  const initialized = useRef(false)
  const running = useRef(false)
  const errorRef = useRef<HTMLParagraphElement>(null)
  const [hasLink, setHasLink] = useState(false)
  const [review, setReview] = useState<Review | null>(null)
  const [email, setEmail] = useState('')
  const [authority, setAuthority] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)
  useEffect(() => { if (error) errorRef.current?.scrollIntoView({ block: 'nearest' }) }, [error])
  function applyReview(data: unknown) {
    setAuthority(false)
    if (isRecord(data) && data.completed === true && typeof data.message === 'string') {
      setReview(null); setMessage(data.message)
    } else { setReview(parseReview(data)); setMessage('') }
    token.current = ''; setHasLink(false)
  }
  useEffect(() => {
    let active = true
    if (!initialized.current) {
      token.current = window.location.hash.slice(1)
      if (!/^[a-f0-9]{64}$/.test(token.current)) token.current = ''
      window.history.replaceState(null, '', window.location.pathname)
      initialized.current = true
    }
    setHasLink(Boolean(token.current))
    if (token.current) { setChecking(false); return }
    void send('review', {}).then(data => { if (active) applyReview(data) }).catch(err => { if (active) setError(err instanceof Error ? err.message : 'Restore your review or request a new link.') }).finally(() => { if (active) setChecking(false) })
    return () => { active = false }
  }, [])
  useEffect(() => {
    if (!review) return
    const timer = setTimeout(() => { setAuthority(false); setError('Your review has expired. Ask for a new invitation, or request a fresh withdrawal link below.') }, Math.max(0, Date.parse(review.expires_at) - Date.now()))
    return () => clearTimeout(timer)
  }, [review])
  async function run(action: () => Promise<void>) {
    if (running.current) return
    running.current = true
    setBusy(true); setError('')
    try { await action() } catch (err) { setError(err instanceof Error ? err.message : 'Restore your review before retrying.') } finally { running.current = false; setBusy(false) }
  }
  async function confirm() {
    await run(async () => {
      await send('prepare', {})
      try { applyReview(await send('confirm', { token: token.current })) }
      catch (err) {
        try { applyReview(await send('review', {})) }
        catch { throw err }
      }
    })
  }
  async function decide(decision: 'authorize' | 'decline' | 'not_guardian' | 'withdraw') {
    await run(async () => {
      if (!review || Date.parse(review.expires_at) <= Date.now()) throw Error('Your review has expired. Request a fresh email link before deciding.')
      try {
        const result = await send('decision', { decision, adult_and_authority: authority, versions: review.versions })
        setReview(null); setHasLink(false); setAuthority(false)
        setMessage(isRecord(result) && typeof result.message === 'string' ? result.message : 'Your decision was recorded.')
      } catch (err) {
        let recovered: unknown
        try { recovered = await send('review', {}) } catch { throw err }
        applyReview(recovered)
        if (!isRecord(recovered) || recovered.completed !== true) throw err
      }
    })
  }
  const button = 'min-h-12 rounded-xl border px-5 py-3 text-left disabled:opacity-50'
  const expired = review !== null && Date.parse(review.expires_at) <= Date.now()
  const unavailable = busy || checking || expired
  return <main className="min-h-screen bg-background px-5 py-12 text-foreground sm:py-20"><div className="mx-auto max-w-2xl space-y-7">
    <a href="/" className="font-semibold text-[#0460d8]">Cozy Health</a>
    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">A thoughtful choice for their wellbeing.</h1>
    <p className="leading-7 text-muted-foreground">Parent or legal guardian authorization lets a young person request access to Cozy Health. It does not give you access to their private journals, messages or assessment results.</p>
    {error && <p ref={errorRef} role="alert" className="rounded-xl border p-4">{error}</p>}
    {message && <p role="status" className="rounded-xl border p-4">{message}</p>}
    {checking && <p role="status">Checking for a saved review…</p>}
    {hasLink && !review && !message && <section className="space-y-4 rounded-2xl border p-6"><h2 className="text-xl font-semibold">Confirm your email</h2><p>Continue only if you control the email address that received this link. This step confirms email access. It does not yet authorize participation.</p><button className={button} disabled={busy || checking} onClick={confirm}>Confirm email and review request</button></section>}
    {review && <section className="space-y-5 rounded-2xl border p-6"><h2 className="text-xl font-semibold">Request for {review.account_first_name}</h2>
      {review.withdrawal ? <><p>Withdraw your authorization? Future private access will be restricted. Existing records will be preserved securely; withdrawal does not delete the account.</p><button className={button} disabled={unavailable} onClick={() => decide('withdraw')}>Withdraw authorization</button></> : <>
        <p>Read these documents before deciding. Authorization is separate from the young person’s own choices, provider sharing and any paid subscription.</p>
        {Object.entries(review.documents).map(([key, doc]) => <details key={key} className="rounded-xl border p-4"><summary className="cursor-pointer py-2 font-medium">{doc.title} · {doc.version}</summary><p className="mt-4 whitespace-pre-wrap leading-7">{doc.content}</p></details>)}
        {!review.documents_ready && <p role="status">The required documents are not effective yet. Authorization is unavailable.</p>}
        <label className="flex min-h-12 items-start gap-3"><input type="checkbox" className="mt-1 size-5 shrink-0" disabled={unavailable} checked={authority} onChange={event => setAuthority(event.target.checked)} />I am at least 18, have parental or legal guardian authority for this young person, and authorize the processing described in the documents above. I understand that no private records are shared with me.</label>
        <div className="flex flex-wrap gap-3"><button className={button + ' bg-[#0460d8] text-white'} disabled={unavailable || !authority || !review.documents_ready} onClick={() => decide('authorize')}>Authorize</button><button className={button} disabled={unavailable} onClick={() => decide('decline')}>Decline</button><button className={button} disabled={unavailable} onClick={() => decide('not_guardian')}>I am not their guardian</button></div>
      </>}
    </section>}
    {!checking && !message && <button className={button} disabled={busy} onClick={() => run(async () => applyReview(await send('review', {})))}>Restore review / check saved decision</button>}
    {!checking && !review && !hasLink && !message && <p>Reopen the link in your email to start a review. If it was used, replaced or expired, ask the young person to send a new invitation. For withdrawal, request a fresh link below. No authorization is granted by visiting this page.</p>}
    {(!review || expired) && <form className="space-y-4 rounded-2xl border p-6" onSubmit={event => { event.preventDefault(); void run(async () => { await send('withdrawal', { email }); setMessage('If an active authorization matches, a confirmation link will be sent.'); setEmail('') }) }}><h2 className="text-xl font-semibold">Withdraw an earlier authorization</h2><label className="block">Your guardian email<input required type="email" maxLength={190} value={email} onChange={event => setEmail(event.target.value)} className="mt-2 block min-h-12 w-full rounded-lg border bg-background p-3" /></label><button disabled={busy || checking} className={button}>Email me a withdrawal link</button></form>}
    <p className="text-sm leading-6">Questions or a disputed request? Contact <a className="underline" href="mailto:Team@cozyhealth.org">Team@cozyhealth.org</a>. Do not email identity documents or private journals. This inbox is not an emergency service.</p>
    <nav className="flex flex-wrap gap-5 text-sm underline"><a href="/guardians">Young people and guardian notice</a><a href="/privacy">Privacy</a><a href="/support">Support</a></nav>
  </div></main>
}
