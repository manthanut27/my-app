import { describe, it, expect } from 'vitest'
import { runAudit } from '../../lib/audit/auditEngine'

describe('auditEngine', () => {
  // ── Test 1: Plan-Seat Mismatch → Downgrade ───────────────────────────────
  it('Test 1: Plan-seat mismatch triggers downgrade recommendation', () => {
    const result = runAudit({
      tools: [{ toolId: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 }],
      teamSize: 2,
      useCase: 'coding',
    })
    const toolResult = result.results[0]
    expect(toolResult.recommendedAction).toBe('downgrade')
    // cursor business = $40/seat, cursor pro = $20/seat
    // savings = ($40 - $20) * 2 seats = $40
    expect(toolResult.projectedMonthlySavings).toBe(40)
    expect(toolResult.reason).toContain('Team plans are cost-effective')
  })

  // ── Test 2: Already-Optimal Plan ────────────────────────────────────────
  it('Test 2: Already-optimal plan returns "optimal"', () => {
    const result = runAudit({
      tools: [{ toolId: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: 'coding',
    })
    const toolResult = result.results[0]
    expect(toolResult.recommendedAction).toBe('optimal')
    expect(toolResult.projectedMonthlySavings).toBe(0)
  })

  // ── Test 3: Use-Case Mismatch → Switch ───────────────────────────────────
  it('Test 3: Use-case mismatch triggers "switch" recommendation', () => {
    const result = runAudit({
      tools: [{ toolId: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: 'writing', // cursor only fits 'coding'
    })
    const toolResult = result.results[0]
    expect(toolResult.recommendedAction).toBe('switch')
    expect(toolResult.alternativeTool).not.toBeNull()
  })

  // ── Test 4: Aggregate Savings = Sum of Per-Tool Savings ──────────────────
  it('Test 4: Aggregate savings equal sum of per-tool savings', () => {
    // Two tools each with $20/mo savings:
    // - cursor business, 2 seats (savings = $40 from Check 1)
    // - github-copilot business, 2 seats (savings = ($19-$10)*2 = $18 from Check 1)
    // Actually to guarantee $20 each, let's use overpay scenario:
    // cursor pro, 1 seat, $24 spend → overpay delta = $24-$20 = $4 ... that's $4
    // Instead: two cursor business with 2 seats = $40 each isn't possible with one tool type
    // Use: cursor business 2 seats ($40 savings) + github-copilot business 2 seats ($18 savings)
    // Total = $58
    const result = runAudit({
      tools: [
        { toolId: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 },        // $40 savings
        { toolId: 'github-copilot', plan: 'business', monthlySpend: 38, seats: 2 }, // $18 savings
      ],
      teamSize: 2,
      useCase: 'coding',
    })
    const savings1 = result.results[0].projectedMonthlySavings
    const savings2 = result.results[1].projectedMonthlySavings
    expect(result.totalMonthlySavings).toBe(
      Math.round((savings1 + savings2) * 100) / 100
    )
    expect(result.totalAnnualSavings).toBe(
      Math.round(result.totalMonthlySavings * 12 * 100) / 100
    )
  })

  // ── Test 5: showCredexCTA when savings > $500 ────────────────────────────
  it('Test 5: showCredexCTA is true when savings > $500/mo', () => {
    // Uses Check 2 (overpay detection):
    // cursor pro official = $20/seat. Paying $600 (1 seat).
    // overpayThreshold = $20 * 1.10 = $22. $600 > $22 → triggers.
    // delta = $600 - $20 = $580 → projectedMonthlySavings = $580
    // $580 > $500 → showCredexCTA = true
    const result = runAudit({
      tools: [
        {
          toolId: 'cursor',
          plan: 'pro',
          monthlySpend: 600, // massively overpaying vs $20 official
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: 'coding',
    })
    expect(result.totalMonthlySavings).toBeGreaterThan(500)
    expect(result.showCredexCTA).toBe(true)
  })

  // ── Test 6: showNotifyMe when savings < $100 ─────────────────────────────
  it('Test 6: showNotifyMe is true when all tools are optimal', () => {
    const result = runAudit({
      tools: [
        { toolId: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }, // optimal
      ],
      teamSize: 1,
      useCase: 'coding',
    })
    expect(result.showNotifyMe).toBe(true)
    expect(result.totalMonthlySavings).toBe(0)
  })

  // ── Test 7: Overpay Detection ─────────────────────────────────────────────
  it('Test 7: Overpay detection flags when spend > official price by >10%', () => {
    // github-copilot individual = $10/seat. $15 spend = 50% overpay → should flag
    const result = runAudit({
      tools: [{ toolId: 'github-copilot', plan: 'individual', monthlySpend: 15, seats: 1 }],
      teamSize: 1,
      useCase: 'coding',
    })
    const toolResult = result.results[0]
    expect(toolResult.reason).toContain('above the listed price')
  })
})
