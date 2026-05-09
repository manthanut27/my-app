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
          href="https://credex.rocks"
          target="_blank"
          rel="noopener noreferrer"
          id="credex-cta-btn"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF88] text-[#0A0A0A] font-mono font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors flex-shrink-0 whitespace-nowrap"
        >
          FINANCE WITH CREDEX
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </a>
      </div>
    </div>
  )
}
