import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ToolResult } from '../types/audit'
import { TOOL_DISPLAY_NAMES } from '../constants/tools'
import type { ToolId } from '../types/tools'

/**
 * Generate a ~100-word AI audit summary using Gemini.
 * Falls back to a templated string if the API call fails.
 */
export async function generateSummary(params: {
  results: ToolResult[]
  totalMonthlySavings: number
  useCase: string
  teamSize: number
}): Promise<{ summary: string; fallback: boolean }> {
  const { results, totalMonthlySavings, useCase, teamSize } = params

  // Attempt Gemini generation
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY not set')

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are a financial advisor specializing in AI tool spend optimization.
Write a 100-word personalized audit summary for a ${teamSize}-person team whose primary use case is ${useCase}.
Their audit results: ${JSON.stringify(results)}
Total monthly savings identified: $${totalMonthlySavings}
Be specific, use numbers, and end with one clear action they should take first. Do not use bullet points. Plain paragraph only.`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    if (!text) throw new Error('Empty response from Gemini')

    return { summary: text, fallback: false }
  } catch {
    // Fallback: templated summary — never shows an error to the user
    return { summary: buildFallbackSummary(params), fallback: true }
  }
}

function buildFallbackSummary(params: {
  results: ToolResult[]
  totalMonthlySavings: number
  useCase: string
  teamSize: number
}): string {
  const { results, totalMonthlySavings, useCase, teamSize } = params

  // Find the tool with the highest potential savings
  const topResult = [...results].sort(
    (a, b) => b.projectedMonthlySavings - a.projectedMonthlySavings
  )[0]

  const topToolName = topResult
    ? (TOOL_DISPLAY_NAMES[topResult.toolId as ToolId] ?? topResult.toolId)
    : 'your top tool'
  const topSavings = topResult?.projectedMonthlySavings ?? 0
  const toolCount = results.length

  return `Your team of ${teamSize} is spending on ${toolCount} AI tool${toolCount > 1 ? 's' : ''} for ${useCase} work. Our audit identified $${totalMonthlySavings}/month in potential savings across your stack. The biggest opportunity is ${topToolName}, where switching plans could save you $${topSavings}/month. Start there.`
}
