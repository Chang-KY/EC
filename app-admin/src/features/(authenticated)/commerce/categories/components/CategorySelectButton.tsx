'use client'

import React from 'react'
import clsx from 'clsx'
import { getMeta } from '@/features/(authenticated)/commerce/categories/categoryMeta'
import { LevelType } from '@/features/(authenticated)/commerce/categories/types/DepthType'

export default function CategorySelectButton({
  type,
  openCategoryModal,
  description,
  deleteCategory,
  isSelected,
  isSelectedSecond,
}: {
  type: LevelType
  openCategoryModal?: () => void
  deleteCategory?: () => void
  description?: string
  isSelected?: boolean
  isSelectedSecond?: boolean
}) {
  const meta = getMeta(type)

  return (
    <div
      id={meta.badge}
      className={clsx(
        'flex h-44 w-1/4 min-w-0 flex-col overflow-hidden rounded border',
        meta.badgeClass,
      )}
    >
      <div className="flex h-10 w-full items-center gap-2 border-b border-gray-200 px-3">
        <h3 className="shrink-0 text-sm font-semibold text-gray-900">{meta.label}</h3>

        <p className="min-w-0 flex-1 truncate text-[10px] text-gray-700">({meta.hint})</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between px-3 py-2">
        <div className="min-h-0 min-w-0">
          <p
            className={clsx(
              'line-clamp-2 text-xs wrap-break-word text-red-400',
              isSelected && 'hidden',
            )}
          >
            {meta.noSelected}
          </p>

          <p className="mt-2 text-[11px] font-medium text-gray-500">- 카테고리</p>

          <p className="mt-1 line-clamp-2 min-w-0 text-sm leading-snug font-semibold wrap-break-word text-gray-900">
            {description ?? '선택되지 않았어요'}
          </p>
        </div>

        {!isSelectedSecond && (
          <div className="mt-2 flex shrink-0 justify-end gap-2">
            {deleteCategory && (
              <button
                type="button"
                onClick={deleteCategory}
                className="rounded-full border border-red-300 bg-white px-2 py-1 text-xs font-medium whitespace-nowrap text-red-500 hover:text-red-700"
              >
                삭제
              </button>
            )}
            {openCategoryModal && (
              <button
                type="button"
                onClick={openCategoryModal}
                className="rounded-full border bg-white px-2 py-1 text-xs font-medium whitespace-nowrap text-gray-500 hover:text-gray-700"
              >
                계층 찾기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
