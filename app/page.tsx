import SpendForm from '../components/form/SpendForm'

export const metadata = {
  title: 'StackAudit — Know Exactly What You\'re Overpaying for AI Tools',
  description:
    'Audit your AI tool spend in under 3 minutes. Get an instant breakdown of where you\'re overpaying — and exactly what to do about it. Free, no login required.',
  openGraph: {
    title: 'StackAudit — AI Spend Audit Tool',
    description:
      'Free tool to audit your team\'s AI tool spend. Identify overpayment, surface cheaper alternatives, get a shareable report.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'StackAudit',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StackAudit — AI Spend Audit Tool',
    description: 'Free tool to audit your AI tool spend. Identify savings in under 3 minutes.',
    images: ['/og-image.png'],
  },
}

export default function HomePage() {
  return (
    <main className="flex-grow flex flex-col lg:flex-row max-w-[1440px] mx-auto w-full">
      {/* ── Hero Left Column ─────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-24 min-h-[560px] lg:min-h-screen relative z-10 border-r border-outline-variant">
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

        {/* Eyebrow */}
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-6 relative z-10 block">
          AI Spend Oversight · Free Tool
        </span>

        <h1 className="font-display-xl text-display-xl mb-6 relative z-10">
          Stop guessing what your AI stack costs.
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-10 relative z-10">
          Paste in your tools and plans. Get an instant audit of where you're
          overpaying — and exactly what to do about it.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12 relative z-10">
          <a
            href="#audit-form"
            className="bg-primary-container text-surface px-8 py-4 font-data-md text-data-md rounded-none hover:bg-primary-fixed-dim transition-colors inline-flex items-center gap-2 uppercase tracking-tight"
          >
            Audit My Stack
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              arrow_forward
            </span>
          </a>
        </div>

        {/* Trust chips */}
        <div className="flex flex-wrap gap-3 relative z-10">
          <div className="px-3 py-1 bg-surface-container-low border border-outline-variant rounded-full flex items-center gap-2">
            <span
              className="material-symbols-outlined text-on-surface-variant text-[16px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              lock_open
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">No login required</span>
          </div>
          <div className="px-3 py-1 bg-surface-container-low border border-outline-variant rounded-full flex items-center gap-2">
            <span
              className="material-symbols-outlined text-on-surface-variant text-[16px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              money_off
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">Free forever</span>
          </div>
          <div className="px-3 py-1 bg-surface-container-low border border-outline-variant rounded-full flex items-center gap-2">
            <span
              className="material-symbols-outlined text-on-surface-variant text-[16px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              timer
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">Results in 30 seconds</span>
          </div>
        </div>
      </div>

      {/* ── Form Right Column ─────────────────────────────────────────────── */}
      <div
        id="audit-form"
        className="w-full lg:w-1/2 bg-surface px-6 py-16 lg:py-24 border-l border-outline-variant lg:-ml-[1px]"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-headline-md text-headline-md mb-8">Your AI Stack</h2>
          <SpendForm />
        </div>
      </div>
    </main>
  )
}
