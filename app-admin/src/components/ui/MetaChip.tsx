import React from 'react'
import clsx from 'clsx'
import type { LucideIcon } from 'lucide-react'

export default function MetaChip({
  label,
  icon: Icon,
  className,
}: {
  label: string
  icon?: LucideIcon
  className?: string
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold',
        'bg-gray-50 text-gray-800 ring-1 ring-gray-200',
        'dark:bg-zinc-950 dark:text-zinc-100 dark:ring-zinc-800',
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5" /> : null}
      <span>{label}</span>
    </span>
  )
}
