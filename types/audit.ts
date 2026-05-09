// Core type definitions for the StackAudit audit engine

export type RecommendedAction = 'downgrade' | 'switch' | 'optimal' | 'credits'

export type UseCaseType = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export interface ToolInput {
  toolId: string
  plan: string
  monthlySpend: number
  seats: number
}

export interface ToolResult {
  toolId: string
  currentPlan: string
  monthlySpend: number
  recommendedAction: RecommendedAction
  alternativeTool: string | null
  projectedMonthlySavings: number
  projectedAnnualSavings: number
  reason: string
}

export interface AuditInput {
  tools: ToolInput[]
  teamSize: number
  useCase: UseCaseType
}

export interface AuditSummary {
  results: ToolResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  isOptimal: boolean
  showCredexCTA: boolean
  showNotifyMe: boolean
}
