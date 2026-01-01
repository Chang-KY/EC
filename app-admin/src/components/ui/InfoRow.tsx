import React from 'react'
import InfoRowInputUpdate from '@/components/ui/InfoRowInputUpdate'

export default function InfoRow({
  label,
  value,
  hint,
  action,
}: {
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="flex h-[50px] items-center justify-between gap-4 rounded-md border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-black">
      <div className="min-w-fit shrink-0">
        <p className="text-xs leading-none font-medium whitespace-nowrap text-gray-500">{label}</p>
        {hint && <p className="mt-0.5 text-[11px] whitespace-nowrap text-gray-400">{hint}</p>}
      </div>

      <div className="relative flex min-w-0 flex-1 items-center justify-end gap-2">
        <div className="min-w-0 truncate text-sm font-semibold text-gray-900 dark:text-white">
          {value}
        </div>
        {action && action}
      </div>
    </div>
  )
}
