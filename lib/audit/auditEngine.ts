import type { AuditInput, AuditSummary, ToolInput, ToolResult, UseCaseType } from '../../types/audit'
import { PRICING } from './pricingData'
import { aggregateSavings } from './savingsCalc'
import { TOOL_DISPLAY_NAMES } from '../../constants/tools'
import type { ToolId } from '../../types/tools'

// Tools eligible for the Credex credits opportunity note
const CREDITS_ELIGIBLE_TOOLS: string[] = ['cursor', 'claude', 'chatgpt', 'github-copilot']

/**
 * Evaluate a single tool against the 5 audit checks.
 * Checks run in priority order — first triggered check wins.
 */
function auditTool(input: ToolInput, useCase: UseCaseType): ToolResult {
  const { toolId, plan, monthlySpend, seats } = input

  // Find the pricing rule for this tool + plan
  const currentRule = PRICING.find(
    (p) => p.toolId === toolId && p.plan === plan
  )

  // If we don't recognise the plan, treat as optimal with a note
  if (!currentRule) {
    return {
      toolId,
      currentPlan: plan,
      monthlySpend,
      recommendedAction: 'optimal',
      alternativeTool: null,
      projectedMonthlySavings: 0,
      projectedAnnualSavings: 0,
      reason: "We couldn't find this plan in our database. Verify your plan details on the vendor portal.",
    }
  }

  const officialMonthly = currentRule.pricePerSeatPerMonth * seats

  // ── Check 1: Plan-Seat Mismatch ──────────────────────────────────────────
  // Team/business/enterprise plan with fewer than 3 seats → downgrade
  if (currentRule.tier === 'team' || currentRule.tier === 'enterprise') {
    if (seats < 3) {
      // Find the most comparable individual plan (highest-priced individual tier = most features)
      const individualPlan = PRICING.filter(
        (p) => p.toolId === toolId && p.tier === 'individual'
      ).sort((a, b) => a.pricePerSeatPerMonth - b.pricePerSeatPerMonth).pop()

      if (individualPlan) {
        const savings = (currentRule.pricePerSeatPerMonth - individualPlan.pricePerSeatPerMonth) * seats
        if (savings > 0) {
          return {
            toolId,
            currentPlan: plan,
            monthlySpend,
            recommendedAction: 'downgrade',
            alternativeTool: null,
            projectedMonthlySavings: savings,
            projectedAnnualSavings: savings * 12,
            reason: `Team plans are cost-effective at 3+ seats. At ${seats} seat${seats > 1 ? 's' : ''}, ${individualPlan.plan} saves you $${savings}/mo.`,
          }
        }
      }
    }
  }

  // ── Check 2: Overpay vs Official Price ───────────────────────────────────
  // monthlySpend > officialPrice * 1.10 (i.e., >10% over listed price)
  // Skip for API/usage-based tools (pricePerSeatPerMonth === 0)
  if (currentRule.pricePerSeatPerMonth > 0 && officialMonthly > 0) {
    const overpayThreshold = officialMonthly * 1.10
    if (monthlySpend > overpayThreshold) {
      const delta = Math.round((monthlySpend - officialMonthly) * 100) / 100
      return {
        toolId,
        currentPlan: plan,
        monthlySpend,
        recommendedAction: 'downgrade',
        alternativeTool: null,
        projectedMonthlySavings: delta,
        projectedAnnualSavings: delta * 12,
        reason: `You're paying $${delta}/mo above the listed price. Verify your plan on the vendor portal.`,
      }
    }
  }

  // ── Check 3: Use-Case Mismatch ───────────────────────────────────────────
  // Tool's useCaseFit doesn't include the team's primary use case
  if (!currentRule.useCaseFit.includes(useCase)) {
    // Find cheapest alternative tool that fits the use case
    const alternatives = PRICING.filter(
      (p) => p.useCaseFit.includes(useCase) && p.toolId !== toolId && p.tier !== 'api'
    ).sort((a, b) => a.pricePerSeatPerMonth - b.pricePerSeatPerMonth)

    const best = alternatives[0]
    if (best) {
      const alternativeCost = best.pricePerSeatPerMonth * seats
      const savings = monthlySpend - alternativeCost
      if (savings > 0) {
        const altName = TOOL_DISPLAY_NAMES[best.toolId as ToolId] ?? best.toolId
        return {
          toolId,
          currentPlan: plan,
          monthlySpend,
          recommendedAction: 'switch',
          alternativeTool: best.toolId,
          projectedMonthlySavings: savings,
          projectedAnnualSavings: savings * 12,
          reason: `For ${useCase} workflows, ${altName} covers the same capabilities at $${best.pricePerSeatPerMonth}/seat/mo.`,
        }
      }
    }
  }

  // ── Check 4: Credits Opportunity ─────────────────────────────────────────
  // Secondary note — does NOT add to savings total
  if (CREDITS_ELIGIBLE_TOOLS.includes(toolId) && monthlySpend >= 50) {
    // Return as 'credits' action with 0 savings (variable, not counted)
    return {
      toolId,
      currentPlan: plan,
      monthlySpend,
      recommendedAction: 'credits',
      alternativeTool: null,
      projectedMonthlySavings: 0,
      projectedAnnualSavings: 0,
      reason: "You may be eligible to offset this spend with AI credits via Credex. Credits savings are variable and not included in your total.",
    }
  }

  // ── Check 5: Already Optimal ─────────────────────────────────────────────
  return {
    toolId,
    currentPlan: plan,
    monthlySpend,
    recommendedAction: 'optimal',
    alternativeTool: null,
    projectedMonthlySavings: 0,
    projectedAnnualSavings: 0,
    reason: "You're on the right plan for your team size and use case.",
  }
}

/**
 * Run the full audit for all tools in the input.
 * Pure TypeScript — no AI, deterministic, testable.
 */
export function runAudit(input: AuditInput): AuditSummary {
  const results: ToolResult[] = input.tools.map((tool) =>
    auditTool(tool, input.useCase)
  )

  return {
    results,
    ...aggregateSavings(results),
  }
}
