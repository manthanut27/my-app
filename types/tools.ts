import type { UseCaseType } from './audit'

// Union type of all 8 supported tool IDs
export type ToolId =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf'

export interface PricingRule {
  toolId: ToolId
  plan: string
  pricePerSeatPerMonth: number  // official vendor price
  minSeats: number
  maxSeats: number | null        // null = unlimited
  useCaseFit: UseCaseType[]     // which use cases this plan fits
  tier: 'individual' | 'team' | 'enterprise' | 'api'
}
