import React from 'react'
import Skeleton from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'
import clsx from 'clsx'

export default async function TableLoading() {
  return (
    <section className="px-20">
      <div className="flex h-28 flex-col justify-center space-y-3">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="flex h-7 items-center justify-between gap-3">
        <div className="flex items-center">
          <Skeleton className="h-7 w-64" />
        </div>
        <Skeleton className="h-7 w-28" />
      </div>
      <div className="my-3 overflow-hidden rounded border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex h-8.5 items-center gap-3 border-b border-zinc-200 px-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Skeleton className="col-span-4 h-4 w-full" />
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex h-10 items-center gap-3 px-4',
                i % 2 === 0 && 'bg-white dark:bg-zinc-950',
                i % 2 === 1 && 'bg-zinc-50/60 dark:bg-zinc-900/30',
              )}
            >
              <Skeleton
                className={clsx(
                  'col-span-4 h-4',
                  i === 0 && 'w-96',
                  i === 1 && 'w-84',
                  i === 2 && 'w-72',
                  i === 3 && 'w-64',
                  i === 4 && 'w-56',
                  i === 5 && 'w-48',
                  i === 6 && 'w-72',
                )}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-[93px]" />
          <Skeleton className="h-4 w-28" />
        </div>

        <div className="flex items-center gap-1.5">
          <Skeleton className="size-7" />
          <Skeleton className="size-7" />
          <Skeleton className="size-7" />
          <Skeleton className="size-7" />
        </div>
      </div>
    </section>
  )
}
