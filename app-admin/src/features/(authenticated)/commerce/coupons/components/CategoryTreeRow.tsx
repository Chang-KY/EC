import React from 'react'
import { Check, ChevronDown, ChevronRight, FolderTree, Plus } from 'lucide-react'
import { useGetCategoryChildren } from '@/features/(authenticated)/commerce/coupons/hooks/useGetCategoryChildren'
import { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoryRootForCoupon'
import Loading from '@/components/loading/Loading'

type CategoryTreeRowProps = {
  category: CategoryListItem
  selectedIds: Set<number>
  onSelectCategories?: (category: CategoryListItem) => void
  level?: number
  maxDepth?: number
}

export function CategoryTreeRow({
  category,
  selectedIds,
  onSelectCategories,
  level = 1,
  maxDepth = 3,
}: CategoryTreeRowProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const canExpand = category.hasChildren && level < maxDepth

  const {
    data: children = [],
    isPending,
    isError,
  } = useGetCategoryChildren({
    parentId: Number(category.id),
    enabled: isOpen && canExpand,
  })

  const isSelected = selectedIds.has(Number(category.id))
  const count = category.childCount ?? 0

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
                  <ChevronDown className="size-4 text-gray-500" />
                ) : (
                  <ChevronRight className="size-4 text-gray-500" />
                )
              ) : (
                <FolderTree className="size-4 text-gray-400" />
              )}
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-medium text-gray-900">{category.name}</p>

                {category.selectable && (
                  <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] text-green-700">
                    선택 가능
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
                <span className="truncate">slug: {category.slug}</span>
                {typeof category.depth === 'number' && <span className='text-indigo-700'>depth {category.depth}</span>}
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
          {category.selectable && (
            <button
              type="button"
              onClick={() => onSelectCategories?.(category)}
              className={
                isSelected
                  ? 'inline-flex h-7 items-center justify-center gap-1 rounded border border-indigo-200 bg-indigo-50 px-2.5 text-[11px] text-indigo-600'
                  : 'inline-flex h-7 items-center justify-center gap-1 rounded border border-gray-300 px-2.5 text-[11px] text-gray-700 hover:bg-gray-50'
              }
            >
              {isSelected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>

      {isOpen && canExpand && (
        <div className="w-full bg-gray-50/40">
          {isPending ? (
            <Loading mention="하위 카테고리 불러오는 중..." size={31.6} />
          ) : isError ? (
            <div className="flex h-[57.6px] items-center justify-center text-xs text-red-500">
              하위 카테고리를 불러오지 못했습니다.
            </div>
          ) : children.length === 0 ? (
            <div className="flex h-[57.6px] w-full items-center justify-center text-xs text-red-500">
              하위 카테고리가 없습니다.
            </div>
          ) : (
            children.map((child) => (
              <CategoryTreeRow
                key={child.id}
                category={child}
                selectedIds={selectedIds}
                onSelectCategories={onSelectCategories}
                level={level + 1}
                maxDepth={maxDepth}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
