export default function CredexCTA() {
  return (
    <div className="bg-[#111111] border border-[#1F1F1F] border-l-4 border-l-primary-container p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="material-symbols-outlined text-primary-container text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface">
              You qualify for Credex
            </h3>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Your team is leaving significant money on the table. Credex helps high-growth
            startups fund and negotiate AI tool costs — turning your savings potential
            into actual savings.
          </p>
        </div>
        <a
          href="https://credex.in"
          target="_blank"
          rel="noopener noreferrer"
          id="credex-cta-btn"
          className="flex-shrink-0 px-6 py-3 bg-primary-container text-black font-label-caps text-label-caps uppercase hover:bg-primary-fixed-dim transition-colors inline-flex items-center gap-2 whitespace-nowrap"
        >
          Book a Credex Consultation
          <span
            className="material-symbols-outlined text-[16px]"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            arrow_forward
          </span>
        </a>
      </div>
    </div>
  )
}
