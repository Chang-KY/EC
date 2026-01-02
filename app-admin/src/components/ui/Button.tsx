'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  // btn-basic
  'inline-flex items-center gap-1.5 h-7 rounded px-3.5 py-1.5 text-xs font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black ' +
    'disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        // btn-add
        add: 'bg-emerald-500/60 text-black border border-emerald-500 hover:bg-emerald-400 dark:bg-emerald-400 focus-visible:ring-emerald-500/70',
        // btn-delete
        delete:
          'bg-red-500/80 text-white border border-red-500 hover:bg-red-400 dark:bg-red-500 focus-visible:ring-red-500/70',
        // btn-update
        update:
          'bg-sky-500/80 text-white border border-sky-500 hover:bg-sky-400 dark:bg-sky-500 focus-visible:ring-sky-500/70',
        // btn-cancel
        cancel:
          'text-gray-700 border border-gray-400 hover:bg-gray-100 dark:bg-zinc-900 dark:border-zinc-700 focus-visible:ring-zinc-500/70',
        confirm:
          'bg-amber-500/85 text-black border border-amber-500 hover:bg-amber-400 dark:bg-amber-500 focus-visible:ring-amber-500/70',
      },
    },
    defaultVariants: {
      variant: 'add',
    },
  },
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    icon?: React.ReactNode
  }

const Button = ({ className, variant, icon, children, ...rest }: ButtonProps) => {
  return (
    <button {...rest} className={cn(buttonVariants({ variant }), className)}>
      {icon && <div>{icon}</div>}
      <span>{children}</span>
    </button>
  )
}

export default Button
