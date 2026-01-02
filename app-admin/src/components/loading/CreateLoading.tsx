import React from 'react'
import Skeleton from '@/components/ui/Skeleton'

export default async function CreateLoading() {
  return (
    <section className="px-20">
      <div className="flex h-28 flex-col justify-center space-y-3">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-5">
          <article className="relative rounded border border-gray-300 bg-white p-5 dark:border-gray-800 dark:bg-black">
            <div className="mb-3 flex h-10 flex-col items-start justify-between gap-3">
              <Skeleton className="h-5 w-30" />
              <Skeleton className="h-4 w-40" />
            </div>

            <div className="space-y-3">
              <Skeleton className="mb-1 h-3 w-20" />
              <div className="flex h-[38px] items-center justify-between gap-3 rounded-md border border-gray-300 px-3 py-4">
                <Skeleton className="h-3 w-30" />
              </div>

              <Skeleton className="mb-1 h-3 w-20" />
              <div className="flex h-[38px] items-center justify-between gap-3 rounded-md border border-gray-300 px-3 py-4">
                <Skeleton className="h-3 w-30" />
              </div>
            </div>
          </article>

          <article className="relative rounded border border-gray-300 bg-white p-5 dark:border-gray-800 dark:bg-black">
            <div className="mb-3 flex h-10 flex-col items-start justify-between gap-3">
              <Skeleton className="h-5 w-30" />
              <Skeleton className="h-4 w-40" />
            </div>

            <div className="space-y-3">
              <div className="flex w-full items-center gap-3">
                <div className="w-full">
                  <Skeleton className="mb-1 h-3 w-20" />
                  <div className="flex h-[38px] items-center justify-between gap-3 rounded-md border border-gray-300 px-3 py-4">
                    <Skeleton className="h-3 w-30" />
                  </div>
                </div>

                <div className="w-full">
                  <Skeleton className="mb-1 h-3 w-20" />
                  <div className="flex h-[38px] items-center justify-between gap-3 rounded-md border border-gray-300 px-3 py-4">
                    <Skeleton className="h-3 w-30" />
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center gap-3">
                <div className="w-full">
                  <Skeleton className="mb-1 h-3 w-20" />
                  <div className="flex h-[38px] items-center justify-between gap-3 rounded-md border border-gray-300 px-3 py-4">
                    <Skeleton className="h-3 w-30" />
                  </div>
                </div>

                <div className="w-full">
                  <Skeleton className="mb-1 h-3 w-20" />
                  <div className="flex h-[38px] items-center justify-between gap-3 rounded-md border border-gray-300 px-3 py-4">
                    <Skeleton className="h-3 w-30" />
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="relative rounded border border-gray-300 bg-white p-5 dark:border-gray-800 dark:bg-black">
            <div className="mb-3 flex h-10 flex-col items-start justify-between gap-3">
              <Skeleton className="h-5 w-30" />
              <Skeleton className="h-4 w-40" />
            </div>

            <div className="space-y-3">
              <Skeleton className="mb-1 h-3 w-20" />
              <div className="flex h-[38px] items-center justify-between gap-3 rounded-md border border-gray-300 px-3 py-4">
                <Skeleton className="h-3 w-30" />
              </div>

              <Skeleton className="mb-1 h-3 w-20" />
              <div className="flex h-[38px] items-center justify-between gap-3 rounded-md border border-gray-300 px-3 py-4">
                <Skeleton className="h-3 w-30" />
              </div>
            </div>
          </article>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28">
          <article className="relative rounded border border-gray-300 bg-white p-5 dark:border-gray-800 dark:bg-black">
            <div className="mb-3 flex h-10 flex-col items-start justify-between gap-3">
              <Skeleton className="h-5 w-30" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex w-full flex-col gap-3">
              <div className="flex h-[50px] w-full items-center justify-between gap-3 rounded-md border border-gray-300 px-3 py-4">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-30" />
              </div>
              <div className="flex h-[50px] w-full items-center justify-between gap-3 rounded-md border border-gray-300 px-3 py-4">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-30" />
              </div>
              <div className="flex h-[50px] w-full items-center justify-between gap-3 rounded-md border border-gray-300 px-3 py-4">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-30" />
              </div>
            </div>
          </article>

          <article className="relative rounded border border-gray-300 bg-white p-5 dark:border-gray-800 dark:bg-black">
            <div className="flex w-full items-center justify-end gap-2.5">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-7 w-24" />
            </div>
          </article>
        </aside>
      </div>
    </section>
  )
}
