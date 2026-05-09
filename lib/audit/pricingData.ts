import type { PricingRule } from '../../types/tools'

// All pricing data verified from official vendor pages.
// IMPORTANT: Update this file when vendor prices change.
// Each section cites source URL and verification date.

export const PRICING: PricingRule[] = [
  // ── Cursor ──────────────────────────────────────────────────────────────
  // Source: https://www.cursor.com/pricing — verified 2025-05-01
  {
    toolId: 'cursor',
    plan: 'hobby',
    pricePerSeatPerMonth: 0,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['coding'],
    tier: 'individual',
  },
  {
    toolId: 'cursor',
    plan: 'pro',
    pricePerSeatPerMonth: 20,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['coding'],
    tier: 'individual',
  },
  {
    toolId: 'cursor',
    plan: 'business',
    pricePerSeatPerMonth: 40,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['coding'],
    tier: 'team',
  },

  // ── GitHub Copilot ───────────────────────────────────────────────────────
  // Source: https://github.com/features/copilot — verified 2025-05-01
  {
    toolId: 'github-copilot',
    plan: 'individual',
    pricePerSeatPerMonth: 10,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['coding'],
    tier: 'individual',
  },
  {
    toolId: 'github-copilot',
    plan: 'business',
    pricePerSeatPerMonth: 19,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['coding'],
    tier: 'team',
  },
  {
    toolId: 'github-copilot',
    plan: 'enterprise',
    pricePerSeatPerMonth: 39,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['coding'],
    tier: 'enterprise',
  },

  // ── Claude (Anthropic) ───────────────────────────────────────────────────
  // Source: https://www.anthropic.com/claude/plans — verified 2025-05-01
  {
    toolId: 'claude',
    plan: 'free',
    pricePerSeatPerMonth: 0,
    minSeats: 1,
    maxSeats: 1,
    useCaseFit: ['writing', 'research', 'mixed'],
    tier: 'individual',
  },
  {
    toolId: 'claude',
    plan: 'pro',
    pricePerSeatPerMonth: 20,
    minSeats: 1,
    maxSeats: 1,
    useCaseFit: ['writing', 'research', 'mixed'],
    tier: 'individual',
  },
  {
    toolId: 'claude',
    plan: 'max',
    pricePerSeatPerMonth: 100,
    minSeats: 1,
    maxSeats: 1,
    useCaseFit: ['writing', 'research', 'data', 'mixed'],
    tier: 'individual',
  },
  {
    toolId: 'claude',
    plan: 'team',
    pricePerSeatPerMonth: 30,
    minSeats: 5,
    maxSeats: null,
    useCaseFit: ['writing', 'research', 'mixed'],
    tier: 'team',
  },
  {
    toolId: 'claude',
    plan: 'api-direct',
    pricePerSeatPerMonth: 0,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['coding', 'data', 'mixed'],
    tier: 'api',
  },

  // ── ChatGPT (OpenAI) ─────────────────────────────────────────────────────
  // Source: https://openai.com/chatgpt/pricing — verified 2025-05-01
  {
    toolId: 'chatgpt',
    plan: 'plus',
    pricePerSeatPerMonth: 20,
    minSeats: 1,
    maxSeats: 1,
    useCaseFit: ['writing', 'research', 'mixed'],
    tier: 'individual',
  },
  {
    toolId: 'chatgpt',
    plan: 'team',
    pricePerSeatPerMonth: 30,
    minSeats: 2,
    maxSeats: null,
    useCaseFit: ['writing', 'research', 'mixed'],
    tier: 'team',
  },
  {
    toolId: 'chatgpt',
    plan: 'api-direct',
    pricePerSeatPerMonth: 0,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['coding', 'data', 'mixed'],
    tier: 'api',
  },

  // ── Anthropic API Direct ─────────────────────────────────────────────────
  // Source: https://www.anthropic.com/api — verified 2025-05-01
  // Usage-based: no per-seat pricing. Audited on monthlySpend only.
  {
    toolId: 'anthropic-api',
    plan: 'api-direct',
    pricePerSeatPerMonth: 0,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['coding', 'data', 'mixed'],
    tier: 'api',
  },

  // ── OpenAI API Direct ────────────────────────────────────────────────────
  // Source: https://openai.com/api/pricing — verified 2025-05-01
  // Usage-based: no per-seat pricing. Audited on monthlySpend only.
  {
    toolId: 'openai-api',
    plan: 'api-direct',
    pricePerSeatPerMonth: 0,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['coding', 'data', 'mixed'],
    tier: 'api',
  },

  // ── Gemini (Google) ──────────────────────────────────────────────────────
  // Source: https://one.google.com/about/plans — verified 2025-05-01
  {
    toolId: 'gemini',
    plan: 'pro',
    pricePerSeatPerMonth: 20,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['writing', 'research', 'mixed'],
    tier: 'individual',
  },
  {
    toolId: 'gemini',
    plan: 'ultra',
    pricePerSeatPerMonth: 30,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['writing', 'research', 'data', 'mixed'],
    tier: 'individual',
  },

  // ── Windsurf ─────────────────────────────────────────────────────────────
  // Source: https://windsurf.com/pricing — verified 2025-05-01
  {
    toolId: 'windsurf',
    plan: 'free',
    pricePerSeatPerMonth: 0,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['coding'],
    tier: 'individual',
  },
  {
    toolId: 'windsurf',
    plan: 'pro',
    pricePerSeatPerMonth: 15,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['coding'],
    tier: 'individual',
  },
  {
    toolId: 'windsurf',
    plan: 'team',
    pricePerSeatPerMonth: 35,
    minSeats: 1,
    maxSeats: null,
    useCaseFit: ['coding'],
    tier: 'team',
  },
]
