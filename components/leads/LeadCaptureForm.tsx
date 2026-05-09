'use client'

import { useState } from 'react'

interface LeadCaptureFormProps {
  auditId: string
  totalMonthlySavings: number
}

export default function LeadCaptureForm({ auditId, totalMonthlySavings }: LeadCaptureFormProps) {
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Client-side honeypot check (belt-and-suspenders)
    if (honeypot !== '') return

    if (!email) {
      setError('Email is required.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId,
          email,
          companyName: companyName || undefined,
          role: role || undefined,
          honeypot,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setError('Too many requests. Please try again later.')
        } else {
          setError(data.error ?? 'Something went wrong.')
        }
        return
      }

      setIsSuccess(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex items-center gap-3 py-6">
        <span className="material-symbols-outlined text-primary-container text-[24px]">check_circle</span>
        <p className="font-body-lg text-body-lg text-primary-container font-medium">
          ✓ Report sent. Check your inbox.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end" noValidate>
      {/* Honeypot field — hidden from humans, must be empty */}
      <input
        name="website"
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
      />

      {/* Email */}
      <div className="flex-1 w-full text-left">
        <label htmlFor="lead-email" className="block font-label-caps text-label-caps text-[#666666] mb-2 uppercase">
          Work Email
        </label>
        <input
          id="lead-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          suppressHydrationWarning={true}
          className="w-full bg-[#0A0A0A] border border-[#1F1F1F] text-on-surface font-body-sm px-4 py-3 focus:outline-none focus:border-primary-container rounded-none transition-colors placeholder:text-surface-bright"
        />
      </div>

      {/* Company */}
      <div className="flex-1 w-full text-left">
        <label htmlFor="lead-company" className="block font-label-caps text-label-caps text-[#666666] mb-2 uppercase">
          Company
        </label>
        <input
          id="lead-company"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Acme Corp"
          className="w-full bg-[#0A0A0A] border border-[#1F1F1F] text-on-surface font-body-sm px-4 py-3 focus:outline-none focus:border-primary-container rounded-none transition-colors placeholder:text-surface-bright"
        />
      </div>

      {/* Role */}
      <div className="flex-1 w-full text-left">
        <label htmlFor="lead-role" className="block font-label-caps text-label-caps text-[#666666] mb-2 uppercase">
          Role
        </label>
        <input
          id="lead-role"
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="CTO"
          className="w-full bg-[#0A0A0A] border border-[#1F1F1F] text-on-surface font-body-sm px-4 py-3 focus:outline-none focus:border-primary-container rounded-none transition-colors placeholder:text-surface-bright"
        />
      </div>

      {/* Submit */}
      <div className="w-full md:w-auto">
        {error && (
          <p className="text-error font-body-sm text-body-sm mb-2">{error}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          id="send-report-btn"
          className="w-full px-6 py-3 bg-primary-container text-black font-label-caps text-label-caps uppercase hover:bg-primary-fixed-dim transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send My Report'}
        </button>
      </div>
    </form>
  )
}
