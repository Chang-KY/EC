'use client'

import React from 'react'
import { flexRender, Table } from '@tanstack/react-table'
import clsx from 'clsx'

type THeadProps<TData> = {
  table: Table<TData>
}

function THeadInner<TData>({ table }: THeadProps<TData>) {
  return (
    <thead className="sticky top-0 z-10">
      {table.getHeaderGroups().map((hg) => (
        <tr key={hg.id}>
          {hg.headers.map((h, index) => {
            const isSortable = h.column.getCanSort()
            const sorted = h.column.getIsSorted()
            return (
              <th
                key={h.id}
                colSpan={h.colSpan}
                className={clsx(
                  `h-8.5 max-h-8.5 min-h-8.5 border-b border-gray-300 px-3 py-2 text-center`,
                  'text-xs whitespace-nowrap text-gray-700 dark:text-gray-200',
                  isSortable && 'cursor-pointer select-none',
                )}
                onClick={isSortable ? h.column.getToggleSortingHandler() : undefined}
              >
                <div className="flex items-center justify-center gap-1 font-normal">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {sorted === 'asc' && <span>▲</span>}
                  {sorted === 'desc' && <span>▼</span>}
                </div>
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )
}

const THead = React.memo(THeadInner) as <TData>(p: THeadProps<TData>) => React.JSX.Element
export default THead
