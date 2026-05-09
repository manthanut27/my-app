'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ToolRow from './ToolRow'
import UseCaseSelector from './UseCaseSelector'
import type { ToolInput } from '../../types/audit'
import type { UseCaseType } from '../../types/audit'
import type { ToolId } from '../../types/tools'

const STORAGE_KEY = 'stackaudit_form'

interface FormState {
  tools: ToolInput[]
  teamSize: number
  useCase: UseCaseType
}

const DEFAULT_STATE: FormState = {
  tools: [
    { toolId: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 },
  ],
  teamSize: 5,
  useCase: 'coding',
}

export default function SpendForm() {
  const router = useRouter()
  const [state, setState] = useState<FormState>(DEFAULT_STATE)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as FormState
        setState(parsed)
      }
    } catch {
      // Silently ignore parse errors
    }
  }, [])

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Silently ignore storage errors
    }
  }, [state])

  const updateTool = useCallback((index: number, updated: ToolInput) => {
    setState((prev) => {
      const tools = [...prev.tools]
      tools[index] = updated
      return { ...prev, tools }
    })
  }, [])

  const removeTool = useCallback((index: number) => {
    setState((prev) => {
      if (prev.tools.length <= 1) return prev // keep at least one
      const tools = prev.tools.filter((_, i) => i !== index)
      return { ...prev, tools }
    })
  }, [])

  const addTool = useCallback(() => {
    setState((prev) => {
      if (prev.tools.length >= 8) return prev
      const newTool: ToolInput = {
        toolId: 'github-copilot' as ToolId,
        plan: 'individual',
        monthlySpend: 0,
        seats: 1,
      }
      return { ...prev, tools: [...prev.tools, newTool] }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (state.tools.length === 0) {
      setError('Add at least one tool before running your audit.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      router.push(`/audit/${data.auditId}`)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Tool table */}
      <div className="bg-surface border border-outline-variant rounded-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-lowest">
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase w-10" />
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase">Tool</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase">Plan</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase text-right w-28">Spend ($)</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase text-right w-20">Seats</th>
                <th className="py-3 px-4 w-10" />
              </tr>
            </thead>
            <tbody>
              {state.tools.map((tool, index) => (
                <ToolRow
                  key={index}
                  tool={tool}
                  onUpdate={(updated: ToolInput) => updateTool(index, updated)}
                  onRemove={() => removeTool(index)}
                  isLast={state.tools.length === 1}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Add tool button */}
        <div className="p-4 border-t border-outline-variant bg-surface-container-lowest">
          <button
            type="button"
            onClick={addTool}
            disabled={state.tools.length >= 8}
            className="font-data-md text-data-md text-primary-container hover:text-primary-fixed-dim transition-colors flex items-center gap-2 uppercase text-[14px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>add</span>
            Add a tool
          </button>
        </div>
      </div>

      {/* Team size + use case */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="team-size"
            className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-2"
          >
            Total Team Size
          </label>
          <input
            id="team-size"
            type="number"
            min={1}
            max={10000}
            value={state.teamSize}
            onChange={(e) =>
              setState((prev) => ({ ...prev, teamSize: Number(e.target.value) }))
            }
            placeholder="e.g. 10"
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-none font-data-md text-data-md text-on-surface p-3 focus:border-primary-container focus:outline-none focus:ring-0 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="use-case"
            className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-2"
          >
            Primary Use Case
          </label>
          <UseCaseSelector
            value={state.useCase}
            onChange={(val: UseCaseType) => setState((prev) => ({ ...prev, useCase: val }))}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="font-body-sm text-body-sm text-error border border-error-container bg-error-container/10 px-4 py-3">
          {error}
        </p>
      )}

      {/* Submit CTA */}
      <button
        type="submit"
        disabled={isLoading || state.tools.length === 0}
        id="run-audit-btn"
        className="w-full h-[52px] bg-primary-container text-surface font-label-caps text-label-caps uppercase tracking-[0.1em] font-bold hover:bg-primary-fixed-dim transition-colors relative group overflow-hidden border border-primary-container disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
              Auditing...
            </>
          ) : (
            <>
              RUN MY AUDIT
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>bolt</span>
            </>
          )}
        </span>
      </button>
    </form>
  )
}
