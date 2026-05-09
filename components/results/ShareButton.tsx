'use client'

import { useState } from 'react'

interface ShareButtonProps {
  auditId: string
}

export default function ShareButton({ auditId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/audit/${auditId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My StackAudit Report',
          text: 'Check out my AI tool spend audit — see where I could save money.',
          url,
        })
      } catch {
        // user cancelled share, do nothing
      }
    } else {
      // fallback: just copy
      handleCopy()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        id="share-audit-btn"
        aria-label="Copy audit link to clipboard"
        className="flex items-center gap-2 px-4 py-2 border border-[#2A2A2A] text-[#E0E0E0] font-mono text-sm uppercase tracking-wider hover:border-[#00FF88] hover:text-[#00FF88] transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        {copied ? 'COPIED!' : 'COPY LINK'}
      </button>

      <button
        onClick={handleShare}
        aria-label="Share audit report"
        className="flex items-center gap-2 px-4 py-2 border border-[#2A2A2A] text-[#E0E0E0] font-mono text-sm uppercase tracking-wider hover:border-[#00FF88] hover:text-[#00FF88] transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        SHARE
      </button>
    </div>
  )
}
