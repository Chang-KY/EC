'use client'

import React from 'react'
import Input from '@/components/ui/Input'
import { Loader2, Search } from 'lucide-react'
import { useKeywordSetParam } from '@/hooks/params/useKeywordSetParam'
import Loading from '@/components/loading/Loading'
import { useGetCategoriesForCoupon } from '@/features/(authenticated)/commerce/coupons/hooks/useGetCategoriesForCoupon'
import type { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoriesForCoupon'
import { ProductCategoryTreeRow } from '@/features/(authenticated)/commerce/products/components/PrdocutCategoryTreeRow'

type SearchCategoryProps = {
  selectedCategories: CategoryListItem[]
  onSelectCategories?: (category: CategoryListItem) => void
}

export default function SearchCategoryForProduct({
  selectedCategories,
  onSelectCategories,
}: SearchCategoryProps) {
  const { keyword, setKeyword, isDebouncing, flush } = useKeywordSetParam(700, '')
  const {
    items: allCategories,
    isPending,
    isError,
  } = useGetCategoriesForCoupon({
    enabled: true,
    keyword,
  })
  const isSearching = isDebouncing || isPending
  const selectedCategory = selectedCategories[0]

  const selectedIds = React.useMemo(() => {
    return new Set(selectedCategories.map((item) => Number(item.id)))
  }, [selectedCategories])

  const childrenByParentId = React.useMemo(() => {
    const map = new Map<number, CategoryListItem[]>()

    for (const item of allCategories) {
      if (item.parent_id == null) continue

      const prev = map.get(Number(item.parent_id)) ?? []
      prev.push(item)
      map.set(Number(item.parent_id), prev)
    }

    return map
  }, [allCategories])

  const rootCategories = React.useMemo(() => {
    return allCategories.filter((item) => item.parent_id == null)
  }, [allCategories])

  const categoryById = React.useMemo(() => {
    const map = new Map<number, CategoryListItem>()

    for (const item of allCategories) {
      map.set(Number(item.id), item)
    }

    return map
  }, [allCategories])

  const getCategoryBreadcrumbByPath = React.useCallback(
    (path: string) => {
      return String(path)
        .split('.')
        .map((id) => Number(id))
        .map((id) => categoryById.get(id)?.name)
        .filter((name): name is string => Boolean(name))
        .join('　>　')
    },
    [categoryById],
  )

  const openPathIds = () => {
    if (!selectedCategory?.path) return new Set<number>()

    return new Set(
      String(selectedCategory.path)
        .split('.')
        .map((id) => Number(id))
        .filter((id) => !Number.isNaN(id)),
    )
  }

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
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500">
            {selectedCategory
              ? getCategoryBreadcrumbByPath(selectedCategory.path as string)
              : '카테고리 선택'}
          </p>
        </div>
      </div>

      <div className="relative flex max-h-100 min-h-100 w-full items-start justify-center rounded border border-gray-300">
        {isPending ? (
          <div className="flex h-100 items-center justify-center">
            <Loading mention="카테고리 데이터를 가져오는 중..." />
          </div>
        ) : isError ? (
          <div className="flex h-100 w-full items-center justify-center">
            <p className="text-xs text-red-500">에러가 발생했습니다.</p>
          </div>
        ) : rootCategories.length === 0 ? (
          <div className="flex h-100 items-center justify-center">
            <p className="text-xs">
              {keyword ? <span className="mr-1 text-red-700">{keyword}</span> : ''}
              카테고리가 존재하지 않습니다.
            </p>
          </div>
        ) : (
          <div className="relative flex h-full w-full flex-col rounded">
            <div className="grid grid-cols-[minmax(0,1fr)_90px_90px] items-center rounded-tl rounded-tr border-b border-gray-200 bg-gray-50 py-2 pr-6 pl-3 text-[11px] font-medium text-gray-500">
              <div className="text-center">카테고리 정보</div>
              <div className="text-center">하위 개수</div>
              <div className="text-center">선택</div>
            </div>

            <div className="h-[366.41px] divide-y divide-gray-100 overflow-y-auto">
              {rootCategories.map((category) => (
                <ProductCategoryTreeRow
                  openFolder={openPathIds().has(Number(category.id))}
                  allCategories={allCategories}
                  key={category.id}
                  category={category}
                  selectedIds={selectedIds}
                  onSelectCategories={onSelectCategories}
                  level={1}
                  maxDepth={3}
                  childrenByParentId={childrenByParentId}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
