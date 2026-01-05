import React from 'react'
import clsx from 'clsx'
import { Ellipsis, LucideIcon, Settings } from 'lucide-react'
import DropdownMenu from '@/components/ui/DropdownMenu/DropdownMenu'

export default function MetaChip({
  label,
  icon: Icon,
  className,
  menuElement = [],
}: {
  label: string
  icon?: LucideIcon
  className?: string
  menuElement?: DropdownMenuState[]
}) {
  return (
    <div className="flex items-center gap-2">
      {menuElement.length > 0 && (
        <DropdownMenu
          align="start"
          triggerButton={
            <Settings className="size-6 rounded-full p-1 text-gray-700 hover:text-indigo-600" />
          }
          label="선택하세요"
          menuElement={menuElement}
        />
      )}
      <span
        className={clsx(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
          'border border-gray-300 bg-gray-50 text-gray-800',
          'dark:bg-zinc-950 dark:text-zinc-100 dark:ring-zinc-800',
          className,
        )}
      >
        {Icon ? <Icon className="size-3.5" /> : null}
        <span>{label}</span>
      </span>
    </div>
  )
}
