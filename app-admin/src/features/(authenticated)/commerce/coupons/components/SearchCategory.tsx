'use client'

import React from 'react'
import Input from '@/components/ui/Input'
import {
  Check,
  ChevronDown,
  ChevronRight,
  FolderTree,
  Loader2,
  Plus,
  Search,
  Tag,
} from 'lucide-react'
import { useKeywordSetParam } from '@/hooks/params/useKeywordSetParam'
import { useGetCategoriesRootForCoupon } from '@/features/(authenticated)/commerce/coupons/hooks/useGetCategoriesRootForCoupon'
import Loading from '@/components/loading/Loading'
import { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoryRootForCoupon'
import { useGetCategoryChildren } from '@/features/(authenticated)/commerce/coupons/hooks/useGetCategoryChildren'
import { CategoryTreeRow } from '@/features/(authenticated)/commerce/coupons/components/CategoryTreeRow'

type SearchCategoryProps = {
  selectedCategories: CategoryListItem[]
  onSelectCategories?: (category: CategoryListItem) => void
}

export default function SearchCategory({
  selectedCategories,
  onSelectCategories,
}: SearchCategoryProps) {
  const { keyword, setKeyword, isDebouncing, flush } = useKeywordSetParam(700, '')
  const { items, hasNextPage, fetchNextPage, isFetchingNextPage, isPending, isError } =
    useGetCategoriesRootForCoupon({ keyword })

  const isSearching = isDebouncing || isPending
  const bottomRef = React.useRef<HTMLDivElement | null>(null)

  const selectedIds = React.useMemo(() => {
    return new Set(selectedCategories.map((item) => item.id))
  }, [selectedCategories])

  React.useEffect(() => {
    const target = bottomRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage().then()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div className="w-full space-y-3">
      <div className="mt-3 flex w-full items-center justify-between gap-3">
        <div className="flex w-48 items-center gap-2">
          <p className="w-14 shrink-0 text-xs text-gray-600">카테고리 명</p>
          <Input
            value={keyword}
            type="text"
            name="search"
            icon={
              isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />
            }
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="상의"
            className="h-7 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') flush()
            }}
          />
        </div>

        <div className="inline-flex h-7 min-w-28 items-center justify-center gap-1 rounded border border-indigo-200 bg-indigo-50 px-2.5 text-[11px] font-medium text-indigo-700">
          <Tag className="size-3.5" />
          <span className="w-3 text-center">{selectedCategories.length}</span>
          <span>개 선택됨</span>
        </div>
      </div>

      <div className="flex max-h-100 min-h-100 w-full items-start justify-center rounded border border-gray-300">
        {isPending ? (
          <div className="flex h-100 items-center justify-center">
            <Loading mention="카테고리 데이터를 가져오는 중..." />
          </div>
        ) : isError ? (
          <div className="flex h-100 w-full items-center justify-center">
            <p className="text-xs text-red-500">에러가 발생했습니다.</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-100 items-center justify-center">
            <p className="text-xs">
              {keyword ? <span className="mr-3 text-red-700">{keyword}</span> : ''}상품이 존재하지
              않습니다.
            </p>
          </div>
        ) : (
          <div className="relative flex h-full w-full flex-col rounded">
            <div className="grid grid-cols-[minmax(0,1fr)_90px_90px] items-center rounded-tl rounded-tr border-b border-gray-200 bg-gray-50 px-3 py-2 text-[11px] font-medium text-gray-500">
              <div className="text-center">카테고리 정보</div>
              <div className="text-center">하위 개수</div>
              <div className="text-center">선택</div>
            </div>
            <div className="h-[366.41px] divide-y divide-gray-100 overflow-y-auto">
              {items.map((category) => (
                <CategoryTreeRow
                  key={category.id}
                  category={category}
                  selectedIds={selectedIds}
                  onSelectCategories={onSelectCategories}
                  level={1}
                  maxDepth={3}
                />
              ))}

              <div ref={bottomRef} className="h-0 w-full" />

              {isFetchingNextPage && (
                <div className="absolute inset-0 flex size-full items-center justify-center">
                  <Loading mention="카테고리를 더 불러오는 중..." />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
