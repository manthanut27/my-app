import ShareButton from './ShareButton'

interface AuditHeroProps {
  totalMonthlySavings: number
  totalAnnualSavings: number
  showCredexCTA: boolean
  auditId: string
}

export default function AuditHero({
  totalMonthlySavings,
  totalAnnualSavings,
  showCredexCTA,
  auditId,
}: AuditHeroProps) {
  const isOptimal = totalMonthlySavings === 0

  return (
    <section className="w-full bg-[#0D0D0D] border-b border-[#1F1F1F] py-12 px-6 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container rounded-full blur-[120px] opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        {/* Savings numbers */}
        <div className="flex flex-col gap-2 relative z-10">
          <span className="font-label-caps text-label-caps text-[#666666] uppercase">
            TOTAL MONTHLY SAVINGS
          </span>

          {isOptimal ? (
            <>
              <h1 className="font-data-lg text-[72px] leading-none text-primary-container tracking-tighter">
                $0
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                You're already spending well on your AI stack
              </p>
            </>
          ) : (
            <>
              <h1 className="font-data-lg text-[72px] leading-none text-primary-container tracking-tighter">
                ${totalMonthlySavings.toFixed(2)}
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                That&apos;s{' '}
                <span className="text-on-surface font-medium">
                  ${totalAnnualSavings.toFixed(2)}
                </span>{' '}
                saved per year
              </p>
            </>
          )}

          {/* Credex chip */}
          {showCredexCTA && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-[#0D2A1A] border border-[#005228] text-primary-container font-label-caps text-label-caps uppercase">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Credex can fund this savings plan
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 relative z-10">
          <ShareButton auditId={auditId} />
          {showCredexCTA && (
            <button className="px-4 py-2 bg-primary-container text-black font-label-caps text-label-caps uppercase hover:bg-primary-fixed-dim transition-colors">
              Finance with Credex
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
