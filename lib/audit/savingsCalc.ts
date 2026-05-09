import type { ToolResult } from '../../types/audit'

/**
 * Aggregate per-tool savings into totals.
 * Values rounded to 2 decimal places.
 * Credits action savings are NOT included (variable, not guaranteed).
 */
export function aggregateSavings(results: ToolResult[]): {
  totalMonthlySavings: number
  totalAnnualSavings: number
  isOptimal: boolean
  showCredexCTA: boolean
  showNotifyMe: boolean
} {
  // Only sum tools with definitive savings (not credits — those are variable)
  const totalMonthlySavings = Math.round(
    results
      .filter((r) => r.recommendedAction !== 'credits')
      .reduce((sum, r) => sum + r.projectedMonthlySavings, 0) * 100
  ) / 100

  const totalAnnualSavings = Math.round(totalMonthlySavings * 12 * 100) / 100

  const isOptimal = results.every(
    (r) => r.recommendedAction === 'optimal' || r.recommendedAction === 'credits'
  )

  const showCredexCTA = totalMonthlySavings > 500
  const showNotifyMe = totalMonthlySavings < 100

  return {
    totalMonthlySavings,
    totalAnnualSavings,
    isOptimal,
    showCredexCTA,
    showNotifyMe,
  }
}
