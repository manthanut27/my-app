import { describe, it, expect } from 'vitest'
import { aggregateSavings } from '../../lib/audit/savingsCalc'
import type { ToolResult } from '../../types/audit'

const makeResult = (
  toolId: string,
  savings: number,
  action: ToolResult['recommendedAction'] = 'downgrade'
): ToolResult => ({
  toolId,
  currentPlan: 'business',
  monthlySpend: 100,
  recommendedAction: action,
  alternativeTool: null,
  projectedMonthlySavings: savings,
  projectedAnnualSavings: savings * 12,
  reason: 'Test reason',
})

describe('savingsCalc — aggregateSavings', () => {
  it('Annual savings equals monthly savings × 12', () => {
    const results = [makeResult('cursor', 50), makeResult('github-copilot', 30)]
    const agg = aggregateSavings(results)
    expect(agg.totalAnnualSavings).toBe(agg.totalMonthlySavings * 12)
  })

  it('Total monthly savings rounds to 2 decimal places', () => {
    // $33.333... + $66.667... = $100 (rounded)
    const results = [
      makeResult('cursor', 33.333),
      makeResult('github-copilot', 66.667),
    ]
    const agg = aggregateSavings(results)
    // Should be 100.00 after rounding
    expect(agg.totalMonthlySavings).toBe(100)
    // Verify it's truly 2dp
    const str = agg.totalMonthlySavings.toString()
    const decimals = str.includes('.') ? str.split('.')[1].length : 0
    expect(decimals).toBeLessThanOrEqual(2)
  })

  it('Credits action savings are NOT included in total', () => {
    const results = [
      makeResult('cursor', 50, 'downgrade'),
      makeResult('claude', 0, 'credits'), // credits: 0 savings, should be excluded from sum
    ]
    const agg = aggregateSavings(results)
    expect(agg.totalMonthlySavings).toBe(50)
  })

  it('isOptimal is true when all results are optimal or credits', () => {
    const results = [
      makeResult('cursor', 0, 'optimal'),
      makeResult('claude', 0, 'credits'),
    ]
    const agg = aggregateSavings(results)
    expect(agg.isOptimal).toBe(true)
  })

  it('showCredexCTA is true when totalMonthlySavings > 500', () => {
    const results = [makeResult('cursor', 600)]
    const agg = aggregateSavings(results)
    expect(agg.showCredexCTA).toBe(true)
  })

  it('showNotifyMe is true when totalMonthlySavings < 100', () => {
    const results = [makeResult('cursor', 0, 'optimal')]
    const agg = aggregateSavings(results)
    expect(agg.showNotifyMe).toBe(true)
  })
})
