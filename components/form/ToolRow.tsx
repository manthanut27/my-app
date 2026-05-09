'use client'

import { TOOL_DISPLAY_NAMES, TOOL_PLANS } from '../../constants/tools'
import type { ToolInput } from '../../types/audit'
import type { ToolId } from '../../types/tools'

interface ToolRowProps {
  tool: ToolInput
  onUpdate: (updated: ToolInput) => void
  onRemove: () => void
  isLast: boolean
}

// Material Symbols icon per tool
const TOOL_ICONS: Record<ToolId, string> = {
  'cursor': 'code_blocks',
  'github-copilot': 'hub',
  'claude': 'smart_toy',
  'chatgpt': 'psychology',
  'anthropic-api': 'api',
  'openai-api': 'api',
  'gemini': 'auto_awesome',
  'windsurf': 'surf',
}

const ALL_TOOL_IDS = Object.keys(TOOL_DISPLAY_NAMES) as ToolId[]

export default function ToolRow({ tool, onUpdate, onRemove, isLast }: ToolRowProps) {
  const plans = TOOL_PLANS[tool.toolId as ToolId] ?? []
  const icon = TOOL_ICONS[tool.toolId as ToolId] ?? 'smart_toy'

  const handleToolChange = (toolId: ToolId) => {
    const newPlans = TOOL_PLANS[toolId] ?? []
    onUpdate({
      ...tool,
      toolId,
      plan: newPlans[0] ?? '',
    })
  }

  return (
    <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
      {/* Tool icon */}
      <td className="py-4 px-4 text-center">
        <div className="w-8 h-8 bg-surface-container-highest border border-outline-variant flex items-center justify-center">
          <span
            className="material-symbols-outlined text-on-surface text-[18px]"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            {icon}
          </span>
        </div>
      </td>

      {/* Tool selector */}
      <td className="py-4 px-4">
        <select
          id={`tool-select-${tool.toolId}`}
          value={tool.toolId}
          onChange={(e) => handleToolChange(e.target.value as ToolId)}
          className="bg-surface-container-lowest border border-outline-variant rounded-none font-body-sm text-body-sm text-on-surface w-full focus:border-primary-container focus:outline-none focus:ring-0 py-1 px-2"
          aria-label="Select tool"
        >
          {ALL_TOOL_IDS.map((id) => (
            <option key={id} value={id}>
              {TOOL_DISPLAY_NAMES[id]}
            </option>
          ))}
        </select>
      </td>

      {/* Plan selector */}
      <td className="py-4 px-4">
        <select
          id={`plan-select-${tool.toolId}`}
          value={tool.plan}
          onChange={(e) => onUpdate({ ...tool, plan: e.target.value })}
          className="bg-surface-container-lowest border border-outline-variant rounded-none font-body-sm text-body-sm text-on-surface w-full focus:border-primary-container focus:outline-none focus:ring-0 py-1 px-2"
          aria-label="Select plan"
        >
          {plans.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
      </td>

      {/* Monthly spend */}
      <td className="py-4 px-4">
        <input
          type="number"
          min={0}
          step={0.01}
          value={tool.monthlySpend}
          onChange={(e) => onUpdate({ ...tool, monthlySpend: Number(e.target.value) })}
          placeholder="0"
          aria-label="Monthly spend in dollars"
          className="bg-transparent border-none p-0 focus:ring-0 font-data-md text-data-md text-on-surface text-right w-full focus:outline-none"
        />
      </td>

      {/* Seats */}
      <td className="py-4 px-4">
        <input
          type="number"
          min={1}
          step={1}
          value={tool.seats}
          onChange={(e) => onUpdate({ ...tool, seats: Number(e.target.value) })}
          placeholder="1"
          aria-label="Number of seats"
          className="bg-transparent border-none p-0 focus:ring-0 font-data-md text-data-md text-on-surface text-right w-full focus:outline-none"
        />
      </td>

      {/* Remove button */}
      <td className="py-4 px-4 text-center">
        <button
          type="button"
          onClick={onRemove}
          disabled={isLast}
          aria-label={`Remove ${TOOL_DISPLAY_NAMES[tool.toolId as ToolId]}`}
          className="text-on-surface-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            close
          </span>
        </button>
      </td>
    </tr>
  )
}
