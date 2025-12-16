import React from 'react'

export default function InfoRow({
  label,
  value,
  hint,
}: {
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-black">
      <div className="min-w-0">
        <p className="text-xs leading-none font-medium text-gray-500">{label}</p>
        {hint ? <p className="mt-0.5 text-[11px] text-gray-400">{hint}</p> : null}
      </div>

      <div className="flex min-w-0 items-center justify-end text-sm font-semibold text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
  )
}
