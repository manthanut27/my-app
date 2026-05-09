'use client'

import { USE_CASE_LABELS } from '../../constants/tools'
import type { UseCaseType } from '../../types/audit'

interface UseCaseSelectorProps {
  value: UseCaseType
  onChange: (value: UseCaseType) => void
}

const USE_CASES = Object.keys(USE_CASE_LABELS) as UseCaseType[]

export default function UseCaseSelector({ value, onChange }: UseCaseSelectorProps) {
  return (
    <select
      id="use-case-select"
      value={value}
      onChange={(e) => onChange(e.target.value as UseCaseType)}
      aria-label="Primary use case"
      className="w-full bg-surface-container-lowest border border-outline-variant rounded-none font-body-sm text-body-sm text-on-surface p-3 h-[46px] focus:border-primary-container focus:outline-none focus:ring-0 transition-colors"
    >
      {USE_CASES.map((uc) => (
        <option key={uc} value={uc}>
          {USE_CASE_LABELS[uc]}
        </option>
      ))}
    </select>
  )
}
