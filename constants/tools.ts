import type { ToolId } from '../types/tools'
import type { UseCaseType } from '../types/audit'

// Display names for each tool ID
export const TOOL_DISPLAY_NAMES: Record<ToolId, string> = {
  'cursor': 'Cursor',
  'github-copilot': 'GitHub Copilot',
  'claude': 'Claude (Anthropic)',
  'chatgpt': 'ChatGPT (OpenAI)',
  'anthropic-api': 'Anthropic API',
  'openai-api': 'OpenAI API',
  'gemini': 'Gemini (Google)',
  'windsurf': 'Windsurf',
}

// Available plans per tool (for dropdown)
export const TOOL_PLANS: Record<ToolId, string[]> = {
  'cursor': ['hobby', 'pro', 'business'],
  'github-copilot': ['individual', 'business', 'enterprise'],
  'claude': ['free', 'pro', 'max', 'team', 'api-direct'],
  'chatgpt': ['plus', 'team', 'api-direct'],
  'anthropic-api': ['api-direct'],
  'openai-api': ['api-direct'],
  'gemini': ['pro', 'ultra'],
  'windsurf': ['free', 'pro', 'team'],
}

// Human-readable labels for use cases
export const USE_CASE_LABELS: Record<UseCaseType, string> = {
  coding: 'Coding / Engineering',
  writing: 'Writing / Content',
  data: 'Data / Analytics',
  research: 'Research',
  mixed: 'Mixed / General',
}
