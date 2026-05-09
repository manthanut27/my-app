'use client'

import { useState, useEffect } from 'react'
import type { ToolResult } from '../../types/audit'

interface AISummaryProps {
  auditId: string
  results: ToolResult[]
  totalMonthlySavings: number
  useCase: string
  teamSize: number
  initialSummary?: string | null
}

export default function AISummary({
  auditId,
  results,
  totalMonthlySavings,
  useCase,
  teamSize,
  initialSummary,
}: AISummaryProps) {
  const [summary, setSummary] = useState<string | null>(initialSummary ?? null)
  const [isLoading, setIsLoading] = useState(!initialSummary)

  useEffect(() => {
    if (initialSummary) return // Already have a summary from the server

    let cancelled = false

    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ auditId, results, totalMonthlySavings, useCase, teamSize }),
        })

        if (!res.ok) throw new Error('Summary API failed')

        const data = await res.json()
        if (!cancelled) {
          setSummary(data.summary)
        }
      } catch {
        // On any error: fallback renders silently — no error UI shown to user
        if (!cancelled) {
          setSummary(
            `Your team is spending on ${results.length} AI tool${results.length > 1 ? 's' : ''}. ` +
            `Our audit identified $${totalMonthlySavings.toFixed(2)}/month in potential savings across your stack.`
          )
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchSummary()
    return () => { cancelled = true }
  }, [auditId, results, totalMonthlySavings, useCase, teamSize, initialSummary])

  return (
    <div className="bg-[#111111] border border-[#1F1F1F] border-l-2 border-l-primary-container p-6 relative">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="material-symbols-outlined text-primary-container text-[18px]"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          psychology
        </span>
        <h2 className="font-label-caps text-label-caps text-[#666666] uppercase">
          AI Analysis
        </h2>
      </div>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="animate-pulse flex flex-col gap-3">
          <div className="h-4 bg-[#1A1A1A] rounded w-full" />
          <div className="h-4 bg-[#1A1A1A] rounded w-4/5" />
          <div className="h-4 bg-[#1A1A1A] rounded w-5/6" />
        </div>
      ) : (
        <p className="font-body-lg text-[15px] leading-relaxed text-on-surface">
          {summary}
        </p>
      )}
    </div>
  )
}
