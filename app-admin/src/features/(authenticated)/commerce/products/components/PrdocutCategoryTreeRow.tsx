'use client'

import React from 'react'
import { Check, ChevronDown, ChevronRight, Circle, FolderTree, Minus } from 'lucide-react'
import type { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoriesForCoupon'
import { HighlightText } from '@/components/ui/HighlightText'
import { getProductCategorySelectionState } from '@/features/(authenticated)/commerce/products/utils/getProductCategorySelectionState'

type CategoryTreeRowProps = {
  openFolder: boolean
  category: CategoryListItem
  allCategories?: CategoryListItem[]
  selectedIds: Set<number>
  onSelectCategories?: (category: CategoryListItem) => void
  level?: number
  maxDepth?: number
  childrenByParentId: Map<number, CategoryListItem[]>
  keyword?: string
}

export function ProductCategoryTreeRow({
  openFolder = false,
  keyword,
  category,
  allCategories,
  selectedIds,
  onSelectCategories,
  level = 1,
  maxDepth = 3,
  childrenByParentId,
}: CategoryTreeRowProps) {
  const [isOpen, setIsOpen] = React.useState(openFolder)
  const selectionState = getProductCategorySelectionState(category, selectedIds, allCategories)
  const children = childrenByParentId.get(Number(category.id)) ?? []

  const canExpand = children.length > 0 && level < maxDepth
  const count = children.length

  return (
    <div className="divide-y divide-gray-100">
      <div
        className="grid grid-cols-[minmax(0,1fr)_90px_90px] items-center px-3 py-2.5 transition-colors hover:bg-gray-50"
        style={{ paddingLeft: `${12 + (level - 1) * 24}px` }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!canExpand) return
                setIsOpen((prev) => !prev)
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-gray-200 bg-gray-50"
            >
              {canExpand ? (
                isOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )
              ) : (
                <FolderTree className="h-4 w-4 text-gray-400" />
              )}
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-medium text-gray-900">
                  <HighlightText text={category.name} keyword={keyword} />
                </p>
              </div>

              <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
                <span className="truncate">slug: {category.slug}</span>
                {typeof category.depth === 'number' && <span>depth {category.depth}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <span className="inline-flex min-w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] text-gray-600">
            {count === 0 ? '-' : count}
          </span>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => onSelectCategories?.(category)}
            className={
              selectionState === 'checked'
                ? 'inline-flex h-7 w-9 items-center justify-center rounded border border-indigo-200 bg-indigo-50 text-indigo-600'
                : selectionState === 'partial'
                  ? 'inline-flex h-7 w-9 items-center justify-center rounded border border-amber-200 bg-amber-50 text-amber-600'
                  : 'inline-flex h-7 w-9 items-center justify-center rounded border border-gray-300 bg-white text-gray-400 hover:bg-gray-50'
            }
          >
            {selectionState === 'checked' ? (
              <Check className="h-3.5 w-3.5" />
            ) : selectionState === 'partial' ? (
              <Minus className="h-3.5 w-3.5" />
            ) : (
              <Circle className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {isOpen && canExpand && (
        <div className="bg-gray-50/40">
          {children.map((child) => (
            <ProductCategoryTreeRow
              openFolder={isOpen}
              key={child.id}
              category={child}
              allCategories={allCategories}
              selectedIds={selectedIds}
              onSelectCategories={onSelectCategories}
              level={level + 1}
              maxDepth={maxDepth}
              childrenByParentId={childrenByParentId}
              keyword={keyword}
            />
          ))}
        </div>
      )}
    </div>
  )
}
