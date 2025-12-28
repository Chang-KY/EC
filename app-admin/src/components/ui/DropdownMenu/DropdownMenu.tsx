import React from 'react'
import {
  DropdownElement,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu/DropdownElement'
import { Info } from 'lucide-react'

export default function DropdownMenu({
  triggerButton,
  label,
  menuElement,
  align,
}: DropdownMenuTypes) {
  return (
    <DropdownElement>
      <DropdownMenuTrigger className="flex items-center justify-center">
        {triggerButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {label && (
          <>
            <DropdownMenuLabel className="flex gap-1">
              <Info size={14} className="text-indigo-500" />
              <p className="text-[10px] text-gray-500">{label}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {menuElement.map((element) => (
          <DropdownMenuItem key={element.id} className="hover:bg-indigo-50">
            {element.element}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownElement>
  )
}
