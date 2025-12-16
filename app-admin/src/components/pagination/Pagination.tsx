'use client'

import React from 'react'
import PaginationButton from '@/components/pagination/PaginationButton'
import clsx from 'clsx'
import Select from '@/components/ui/Select'

type PaginationProps = {
  page: number
  pageSize: number
  total: number
  disabled?: boolean
  onChange: (nextPage: number) => void
  onPageSizeChange?: (nextSize: number) => void
  sizes?: number[]
  itemsType: string
  outerClassName?: string
}

const Pagination = ({
  page,
  pageSize,
  total,
  onChange,
  onPageSizeChange,
  sizes = [10, 20, 50],
  itemsType,
  disabled,
  outerClassName,
}: PaginationProps) => {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = page > 1
  const canNext = page < pageCount

  const go = (p: number) => onChange(Math.min(Math.max(1, p), pageCount))

  const paginationButtons = [
    {
      label: '«',
      ariaLabel: 'first page',
      onClick: () => go(1),
      disabled: !canPrev,
    },
    {
      label: '‹',
      ariaLabel: 'previous page',
      onClick: () => go(page - 1),
      disabled: !canPrev,
    },
    {
      label: '›',
      ariaLabel: 'next page',
      onClick: () => go(page + 1),
      disabled: !canNext,
    },
    {
      label: '»',
      ariaLabel: 'last page',
      onClick: () => go(pageCount),
      disabled: !canNext,
    },
  ]

  return (
    <nav
      aria-label="pagination"
      className={clsx('mb-3 flex items-center justify-between gap-3 text-xs', outerClassName)}
    >
      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <Select
            name="rowsPerPage"
            aria-label="rows per page"
            value={String(pageSize)}
            options={sizes.map((s) => ({
              label: `${s} / page`,
              value: String(s),
            }))}
            className="h-7"
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          />
        )}
        <div className="flex flex-1 items-center gap-2 text-[10px] text-gray-500">
          [ {itemsType} - {total.toLocaleString()}건 ]
          {pageCount === 1 ? null : `· ${page} / ${pageCount}`}
        </div>
      </div>

      <ul className="flex items-center gap-1.5" role="list">
        {paginationButtons.map((btn) => (
          <li key={btn.ariaLabel}>
            <PaginationButton
              contents={btn.label}
              disabled={btn.disabled}
              onClick={btn.onClick}
              ariaLabel={btn.ariaLabel}
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Pagination
