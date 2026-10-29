import Image from 'next/image'

/** Original artwork stays unchanged. No download is offered before store launch. */
export function StoreBadges() {
  const preview = process.env.COZY_DEPLOYMENT_ENV !== 'production'
  return <div className="mt-6 space-y-3">
    <p className="text-sm font-medium text-muted-foreground">Coming to the App Store and Google Play</p>
    {preview && <div className="flex flex-wrap items-center gap-3" aria-label="Store badge design preview; downloads are not available">
      <div className="p-3"><Image src="/store-badges/app-store.svg" alt="Download on the App Store — preview only, not yet available" width={144} height={48} className="h-12 w-auto" /></div>
      <Image src="/store-badges/google-play.png" alt="Get it on Google Play — preview only, not yet available" width={186} height={72} className="h-[72px] w-auto" />
    </div>}
    <p className="text-sm leading-6 text-muted-foreground">Store downloads are not available yet. Join the waitlist for launch updates.</p>
  </div>
}
