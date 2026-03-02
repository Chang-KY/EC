import React from 'react';
import { ChevronDown, ChevronRight, FolderTree, X } from 'lucide-react'
import { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoryRootForCoupon'
import clsx from 'clsx'

type CouponCategoriesRowProps = {
  root: CategoryListItem
  descendants: CategoryListItem[]
  isOpen: boolean
  setOpenSelectedGroups: React.Dispatch<React.SetStateAction<Record<number, boolean>>>
  setAppliesCategoryList: React.Dispatch<React.SetStateAction<CategoryListItem[]>>
}

export default function CouponCategoriesRow({
  root,
  descendants,
  isOpen,
  setOpenSelectedGroups,
  setAppliesCategoryList,
}: CouponCategoriesRowProps) {
  return (
    <div key={root.id} className="divide-y divide-gray-100">
      <div className="grid grid-cols-[56px_minmax(0,1fr)_80px_140px_88px] items-center gap-2 px-3 py-2.5 hover:bg-gray-50">
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              setOpenSelectedGroups((prev) => ({
                ...prev,
                [root.id]: !prev[root.id],
              }))
            }}
            className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-gray-50"
          >
            {descendants.length > 0 ? (
              isOpen ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )
            ) : (
              <FolderTree className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-xs font-medium text-gray-900">{root.name}</p>

            <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-700">
              직접 선택
            </span>

            {descendants.length > 0 && (
              <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">
                하위 {descendants.length}개 자동 포함
              </span>
            )}
          </div>
        </div>

        <div
          className={clsx(
            'text-center text-xs',
            root.depth === 1 && 'text-amber-600',
            root.depth === 2 && 'text-blue-600',
            root.depth === 3 && 'text-purple-600',
          )}
        >
          {typeof root.depth === 'number' ? `depth ${root.depth}` : '-'}
        </div>

        <div className="truncate text-sm text-gray-500">{root.slug}</div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              setAppliesCategoryList((prev) =>
                prev.filter((item) => {
                  const isTargetOrDescendant =
                    item.path === root.path || String(item.path).startsWith(`${root.path}.`)

                  const isAncestor =
                    root.path === item.path || String(item.path).startsWith(`${item.path}.`)

                  return !(isTargetOrDescendant || isAncestor)
                }),
              )
            }}
            className="inline-flex h-7 items-center justify-center gap-1 rounded border border-gray-300 px-2.5 text-[11px] text-gray-700 hover:bg-gray-50"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {isOpen && descendants.length > 0 && (
        <div className="bg-gray-50/40">
          {descendants.map((child) => (
            <div
              key={child.id}
              className="grid grid-cols-[56px_minmax(0,1fr)_80px_140px_88px] items-center gap-2 px-3 py-2.5 pl-10 hover:bg-gray-50"
            >
              <div className="flex items-center justify-center">
                <div className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-white">
                  <FolderTree className="h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs text-gray-800">{child.name}</p>
                  <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">
                    자동 포함
                  </span>
                </div>
              </div>

              <div
                className={clsx(
                  'text-center text-xs',
                  root.depth === 1 && 'text-amber-600',
                  root.depth === 2 && 'text-blue-600',
                  root.depth === 3 && 'text-purple-600',
                )}
              >
                {typeof root.depth === 'number' ? `depth ${root.depth}` : '-'}
              </div>

              <div className="truncate text-[11px] text-gray-500">{child.slug}</div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setAppliesCategoryList((prev) =>
                      prev.filter((item) => {
                        const isTargetOrDescendant =
                          item.path === child.path || String(item.path).startsWith(`${child.path}.`)

                        const isAncestor =
                          child.path === item.path || String(item.path).startsWith(`${item.path}.`)

                        return !(isTargetOrDescendant || isAncestor)
                      }),
                    )
                  }}
                  className="inline-flex h-7 items-center justify-center gap-1 rounded border border-gray-300 px-2.5 text-[11px] text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
