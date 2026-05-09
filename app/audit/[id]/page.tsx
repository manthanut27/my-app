import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AuditHero from '../../../components/results/AuditHero'
import AISummary from '../../../components/results/AISummary'
import ToolCard from '../../../components/results/ToolCard'
import CredexCTA from '../../../components/results/CredexCTA'
import LeadCaptureForm from '../../../components/leads/LeadCaptureForm'
import type { ToolResult } from '../../../types/audit'

interface AuditData {
  auditId: string
  createdAt: string
  teamSize: number
  useCase: string
  results: ToolResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  aiSummary: string | null
  isOptimal: boolean
}

async function getAudit(id: string): Promise<AuditData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/audit/${id}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// Dynamic OG meta per audit
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const audit = await getAudit(id)

  if (!audit) {
    return { title: 'Audit Not Found — StackAudit' }
  }

  const savings = audit.totalMonthlySavings
  const title = savings > 0
    ? `StackAudit — I'm saving $${savings.toFixed(0)}/mo on AI tools`
    : 'StackAudit — My AI Stack is Optimised'

  return {
    title,
    description: 'See what your team could save on AI tool spend. Free audit — no login required.',
    openGraph: {
      title,
      description: 'See what your team could save on AI tool spend.',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/audit/${id}`,
      siteName: 'StackAudit',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: 'See what your team could save on AI tool spend.',
      images: ['/og-image.png'],
    },
  }
}

export default async function AuditResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const audit = await getAudit(id)

  if (!audit) {
    notFound()
  }

  const showCredexCTA = audit.totalMonthlySavings > 500
  const showNotifyMe = audit.totalMonthlySavings < 100

  return (
    <main className="flex-grow flex flex-col items-center w-full max-w-[1440px] mx-auto relative">
      {/* ── Savings Hero ───────────────────────────────────────────────────── */}
      <AuditHero
        totalMonthlySavings={audit.totalMonthlySavings}
        totalAnnualSavings={audit.totalAnnualSavings}
        showCredexCTA={showCredexCTA}
        auditId={audit.auditId}
      />

      {/* ── Content Area ────────────────────────────────────────────────────── */}
      <div className="w-full max-w-5xl px-6 py-12 flex flex-col gap-8">
        {/* AI Summary */}
        <AISummary
          auditId={audit.auditId}
          results={audit.results}
          totalMonthlySavings={audit.totalMonthlySavings}
          useCase={audit.useCase}
          teamSize={audit.teamSize}
          initialSummary={audit.aiSummary}
        />

        {/* Credex CTA — conditional */}
        {showCredexCTA && <CredexCTA />}

        {/* Per-tool breakdown */}
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-6">
            Actionable Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audit.results.map((result, index) => (
              <ToolCard key={`${result.toolId}-${index}`} result={result} />
            ))}
          </div>
        </div>

        {/* "Notify me" — shown when savings are low or all optimal */}
        {showNotifyMe && (
          <div className="bg-[#111111] border border-[#1F1F1F] p-6 text-center">
            <span
              className="material-symbols-outlined text-primary-container text-[32px] mb-4 block"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              check_circle
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">
              You&apos;re spending well on AI
            </h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
              Your stack looks optimised for your team&apos;s use case. We&apos;ll notify you if
              better pricing becomes available.
            </p>
          </div>
        )}

        {/* New audit link */}
        <div className="flex justify-center">
          <a
            href="/"
            className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2 uppercase"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>
              arrow_back
            </span>
            Start a new audit
          </a>
        </div>
      </div>

      {/* ── Lead Capture ──────────────────────────────────────────────────── */}
      <section className="w-full bg-[#0D0D0D] border-t border-[#1F1F1F] py-16 px-6 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-headline-lg text-headline-lg text-on-surface mb-8">
            Get this report in your inbox
          </h3>
          <LeadCaptureForm
            auditId={audit.auditId}
            totalMonthlySavings={audit.totalMonthlySavings}
          />
        </div>
      </section>
    </main>
  )
}
