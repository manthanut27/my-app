import { z } from 'zod'

// ── Tool ID validation ────────────────────────────────────────────────────
const ToolIdSchema = z.enum([
  'cursor',
  'github-copilot',
  'claude',
  'chatgpt',
  'anthropic-api',
  'openai-api',
  'gemini',
  'windsurf',
])

const UseCaseSchema = z.enum(['coding', 'writing', 'data', 'research', 'mixed'])

// ── POST /api/audit ───────────────────────────────────────────────────────
export const AuditInputSchema = z.object({
  teamSize: z.number().int().min(1, 'Team size must be at least 1').max(10000),
  useCase: UseCaseSchema,
  tools: z
    .array(
      z.object({
        toolId: ToolIdSchema,
        plan: z.string().min(1, 'Plan is required'),
        monthlySpend: z.number().min(0, 'Monthly spend cannot be negative'),
        seats: z.number().int().min(1, 'Seats must be at least 1'),
      })
    )
    .min(1, 'At least one tool is required')
    .max(8, 'Maximum 8 tools supported'),
})

// ── POST /api/leads ───────────────────────────────────────────────────────
export const LeadInputSchema = z.object({
  auditId: z.string().uuid('Invalid audit ID'),
  email: z.string().email('Invalid email address'),
  companyName: z.string().max(200).optional(),
  role: z.string().max(100).optional(),
  teamSize: z.number().int().min(1).max(10000).optional(),
  // Honeypot: must be empty string to pass validation
  honeypot: z
    .string()
    .refine((val) => val === '', {
      message: 'Honeypot triggered',
    }),
})

// ── POST /api/summary ─────────────────────────────────────────────────────
export const SummaryInputSchema = z.object({
  auditId: z.string().uuid('Invalid audit ID'),
  results: z.array(z.any()).min(1),
  totalMonthlySavings: z.number().min(0),
  useCase: UseCaseSchema,
  teamSize: z.number().int().min(1),
})

// Type exports
export type AuditInput = z.infer<typeof AuditInputSchema>
export type LeadInput = z.infer<typeof LeadInputSchema>
export type SummaryInput = z.infer<typeof SummaryInputSchema>
