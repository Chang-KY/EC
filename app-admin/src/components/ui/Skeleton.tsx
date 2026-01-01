import React from 'react'
import { cn } from '@/lib/cn'

export default async function Skeleton({ className }: { className: string }) {
  return (
    <div className={cn('animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-800/70', className)} />
  )
}
