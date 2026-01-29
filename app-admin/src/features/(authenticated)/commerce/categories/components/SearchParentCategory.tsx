import React from 'react'
import { X } from 'lucide-react'
import { getQueryClient } from '@/lib/query/getQueryClient'
import { getDepthCategories } from '@/features/(authenticated)/commerce/categories/list/getDepthCategories'
import CategoryList from '@/features/(authenticated)/commerce/categories/components/CategoryList'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

export default async function SearchParentCategory({
  onClose,
  parentId,
  depth,
}: {
  onClose: () => void
  parentId: number | null
  depth: 1 | 2
}) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(getDepthCategories(parentId, depth))

  return (
    <div className="min-w-140 rounded border border-gray-300 bg-white px-4 py-3">
      <header className="flex items-center justify-between text-sm text-gray-700">
        <h2 className="font-semibold">1 계층 카테고리를 선택해주세요.</h2>
        <X
          size={20}
          onClick={onClose}
          className="cursor-pointer rounded-full p-0.5 hover:bg-indigo-100"
        />
      </header>
      <div className="my-1 border border-gray-100" />
      <main className="flex min-h-72 w-full flex-col gap-3">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CategoryList />
        </HydrationBoundary>
      </main>
    </div>
  )
}
