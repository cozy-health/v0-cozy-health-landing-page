"use client"

import { FormEvent, useState } from "react"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("pending")
    const form = event.currentTarget

    try {
      const data = new FormData(form)
      data.set("is_provider", data.get("is_provider") === "Yes" ? "Yes" : "No")
      const response = await fetch("https://formspree.io/f/xjyvwkpj", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })

      if (!response.ok) throw new Error("Submission failed")
      setStatus("success")
      form.reset()
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[#00bc4c]/30 bg-[#00bc4c]/10 p-6 text-left" role="status">
        <CheckCircle2 className="mb-3 h-7 w-7 text-[#006e2c]" aria-hidden="true" />
        <p className="text-lg font-semibold text-foreground">You&apos;re on the list!</p>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          Thanks for signing up. We&apos;ll be in touch with updates and early access details.
        </p>
      </div>
    )
  }

  return (
    <form action="https://formspree.io/f/xjyvwkpj" method="POST" onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
        <input id="name" name="name" type="text" required autoComplete="name" className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-foreground outline-none transition focus:border-[#0460d8] focus:ring-2 focus:ring-[#0460d8]/20" />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">Email address</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-foreground outline-none transition focus:border-[#0460d8] focus:ring-2 focus:ring-[#0460d8]/20" />
      </div>
      <label htmlFor="is-provider" className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl text-sm font-medium text-foreground">
        <input id="is-provider" name="is_provider" type="checkbox" value="Yes" className="h-5 w-5 shrink-0 rounded border-input accent-[#0460d8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0460d8]" />
        I am a healthcare provider
      </label>
      {status === "error" && <p className="text-sm text-[#9a3b00]" role="alert">Something went wrong. Please try again.</p>}
      <p className="text-sm text-muted-foreground">We use your name, email and provider status to respond to your waitlist request through Formspree. <a href="/privacy" className="underline">Privacy Policy</a>.</p>
      <Button type="submit" size="lg" disabled={status === "pending"} className="w-full bg-[#0460d8] text-white hover:bg-[#0460d8]/90">
        {status === "pending" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Joining...</> : <>Join the Waitlist<ArrowRight className="ml-2 h-4 w-4" /></>}
      </Button>
    </form>
  )
}
