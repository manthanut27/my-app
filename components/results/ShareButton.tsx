'use client'

import { useState } from 'react'

interface ShareButtonProps {
  auditId: string
}

export default function ShareButton({ auditId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${window.location.origin}/audit/${auditId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select the URL
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      id="share-audit-btn"
      aria-label="Copy audit link to clipboard"
      className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant text-on-surface font-label-caps text-label-caps uppercase hover:bg-surface-container transition-colors"
    >
      <span
        className="material-symbols-outlined text-[16px]"
        style={{ fontVariationSettings: "'FILL' 0" }}
      >
        {copied ? 'check' : 'content_copy'}
      </span>
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  )
}
