import { describe, it, expect } from 'vitest'
import type { ZodIssue } from 'zod'
import { LeadInputSchema } from '../../lib/validators'

describe('LeadInputSchema — API validation', () => {
  const validBase = {
    auditId: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    honeypot: '',
  }

  // ── Test 1: Honeypot triggered ───────────────────────────────────────────
  it('Test 1: Honeypot field non-empty returns validation error', () => {
    const result = LeadInputSchema.safeParse({
      ...validBase,
      honeypot: 'filled-by-bot',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const messages = result.error.issues.map((issue: ZodIssue) => issue.message)
      expect(messages.some((m: string) => m === 'Honeypot triggered')).toBe(true)
    }
  })

  // ── Test 2: Invalid email format ─────────────────────────────────────────
  it('Test 2: Invalid email format returns validation error', () => {
    const result = LeadInputSchema.safeParse({
      ...validBase,
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const messages = result.error.issues.map((issue: ZodIssue) => issue.message)
      expect(messages.some((m: string) => m.toLowerCase().includes('email'))).toBe(true)
    }
  })

  // ── Test 3: Valid submission passes ─────────────────────────────────────
  it('Test 3: Valid input passes schema validation', () => {
    const result = LeadInputSchema.safeParse({
      ...validBase,
      companyName: 'Acme Corp',
      role: 'CTO',
      teamSize: 10,
    })
    expect(result.success).toBe(true)
  })

  // ── Test 4: Missing required email ───────────────────────────────────────
  it('Test 4: Missing email field returns validation error', () => {
    const { email: _email, ...withoutEmail } = validBase
    const result = LeadInputSchema.safeParse(withoutEmail)
    expect(result.success).toBe(false)
  })
})
