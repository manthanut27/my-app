import type { ToolResult } from '../../types/audit'
import { TOOL_DISPLAY_NAMES } from '../../constants/tools'
import type { ToolId } from '../../types/tools'

interface ToolCardProps {
  result: ToolResult
}

const ACTION_CONFIG = {
  downgrade: {
    icon: 'arrow_downward',
    color: '#FFB800',
    label: 'Downgrade',
    badgeClass: 'border-[#3D2E00] text-[#FFB800]',
  },
  switch: {
    icon: 'swap_horiz',
    color: '#00AAFF',
    label: 'Switch Tool',
    badgeClass: 'border-[#003040] text-[#00AAFF]',
  },
  optimal: {
    icon: 'check',
    color: '#00FF88',
    label: 'Optimal',
    badgeClass: 'border-[#005228] text-primary-container',
  },
  credits: {
    icon: 'bolt',
    color: '#00FF88',
    label: 'Credits Available',
    badgeClass: 'border-[#005228] text-primary-container',
  },
}

export default function ToolCard({ result }: ToolCardProps) {
  const {
    toolId,
    currentPlan,
    monthlySpend,
    recommendedAction,
    projectedMonthlySavings,
    reason,
    alternativeTool,
  } = result

  const config = ACTION_CONFIG[recommendedAction]
  const toolName = TOOL_DISPLAY_NAMES[toolId as ToolId] ?? toolId
  const altToolName = alternativeTool
    ? (TOOL_DISPLAY_NAMES[alternativeTool as ToolId] ?? alternativeTool)
    : null
  const isOptimal = recommendedAction === 'optimal'
  const hasSavings = projectedMonthlySavings > 0

  return (
    <div
      className={`bg-[#111111] border border-[#1F1F1F] p-6 flex flex-col justify-between transition-opacity ${isOptimal ? 'opacity-60' : 'opacity-100'}`}
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-headline-md text-[20px] text-on-surface">{toolName}</h4>
          <span className="bg-[#1F1F1F] text-on-surface font-label-caps text-label-caps px-2 py-1 capitalize">
            {currentPlan.replace('-', ' ')}
          </span>
        </div>

        {/* Action + savings */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="material-symbols-outlined"
            style={{ color: config.color, fontVariationSettings: "'FILL' 0" }}
          >
            {config.icon}
          </span>
          {hasSavings ? (
            <span className="font-data-md text-data-md text-primary-container">
              -${projectedMonthlySavings.toFixed(2)}/mo
            </span>
          ) : (
            <span className="font-data-md text-data-md text-on-surface-variant">
              {config.label}
            </span>
          )}
        </div>

        {/* Savings chip */}
        {hasSavings && (
          <div className="inline-flex items-center gap-2 px-2 py-1 bg-[#0D2A1A] text-primary-container font-label-caps text-label-caps mb-4">
            Saves ${projectedMonthlySavings.toFixed(2)}/mo · ${(projectedMonthlySavings * 12).toFixed(2)}/yr
          </div>
        )}

        {/* Alternative tool chip */}
        {altToolName && (
          <div className="mb-3">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Switch to:{' '}
            </span>
            <span className="font-label-caps text-label-caps text-primary-container">{altToolName}</span>
          </div>
        )}

        {/* Reason */}
        <p className="font-body-sm text-body-sm text-on-surface-variant italic mb-4">
          {reason}
        </p>
      </div>

      {/* Footer: current spend + status badge */}
      <div className="border-t border-[#1F1F1F] pt-4 flex justify-between items-center">
        <span className="font-label-caps text-label-caps text-[#666666]">
          ${monthlySpend.toFixed(2)}/mo current
        </span>
        <span className={`border px-2 py-1 font-label-caps text-[9px] uppercase ${config.badgeClass}`}>
          {isOptimal ? 'In-Limit' : hasSavings ? 'Over-Budget' : 'Review'}
        </span>
      </div>
    </div>
  )
}
