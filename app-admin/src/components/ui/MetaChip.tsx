import React from 'react'
import clsx from 'clsx'
import { Ellipsis, LucideIcon, Settings } from 'lucide-react'
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu'
import { iconButtonClassName } from '@/constants/iconButtonClassName'

export default function MetaChip({
  label,
  icon: Icon,
  className,
  menuElement = [],
  align = 'center',
}: {
  label: string
  icon?: LucideIcon
  className?: string
  menuElement?: DropdownMenuState[]
  align?: 'center' | 'end' | 'start'
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={clsx(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
          'border',
          '',
          className ??
            'border-gray-300 bg-gray-50 text-gray-800 dark:bg-zinc-950 dark:text-zinc-100 dark:ring-zinc-800',
        )}
      >
        {Icon ? <Icon className="size-3.5" /> : null}
        <span>{label}</span>
      </span>

      {menuElement.length > 0 && (
        <DropdownMenu
          align={align}
          triggerButton={
            <div role="button" className={iconButtonClassName}>
              <Settings size={14} />
            </div>
          }
          label="선택하세요"
          menuElement={menuElement}
        />
      )}
    </div>
  )
}
