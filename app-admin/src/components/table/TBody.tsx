'use client'

import * as React from 'react'
import { flexRender, type Table } from '@tanstack/react-table'
import TBodyLoading from '@/components/table/tbody/TBodyLoading'
import TBodyEmpty from '@/components/table/tbody/TBodyEmpty'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

type TBodyProps<TData> = {
  table: Table<TData>
  data: TData[]
  loading?: boolean
  emptyText?: string
  getRowKey?: (row: TData, index: number) => string
  getRowHref?: (row: TData) => string | undefined
  height: string
}

function TBodyInner<TData>({
  table,
  data,
  loading,
  emptyText = '데이터가 없습니다.',
  getRowKey,
  height,
  getRowHref,
}: TBodyProps<TData>) {
  const router = useRouter()
  const rows = table.getRowModel().rows
  const colSpan = table.getVisibleLeafColumns().length

  if (loading) return <TBodyLoading colSpan={colSpan} height={height} /> // 로딩 + 아무 데이터 없을 때
  if (!loading && data.length === 0)
    return <TBodyEmpty emptyText={emptyText} colSpan={colSpan} height={height} /> // 빈 상태
  return (
    <tbody>
      {rows.map((r, i) => {
        const original = r.original as TData
        const href = getRowHref?.(original)

        const go = () => {
          if (href) router.push(href)
        }

        return (
          <tr
            key={getRowKey?.(r.original as TData, i) ?? r.id}
            onClick={href ? go : undefined}
            onKeyDown={(e) => {
              if (!href) return
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                go()
              }
            }}
            role={href ? 'link' : undefined}
            tabIndex={href ? 0 : undefined}
            title={href && `클릭 시 디테일 페이지로 이동합니다.`}
            className={clsx(
              href ? 'cursor-pointer' : '',
              'text-center',
              // 줄무늬
              'odd:bg-stone-50 even:bg-white',
              'dark:odd:bg-stone-950 dark:even:bg-black/40',
              // 호버/포커스
              'hover:bg-gray-200/40',
              'focus-visible:outline dark:hover:bg-zinc-900 dark:focus-visible:outline-indigo-500',
            )}
          >
            {r.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="h-10 max-h-10 min-h-10 max-w-[240px] overflow-hidden px-3 py-2 text-sm text-ellipsis whitespace-nowrap"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        )
      })}
    </tbody>
  )
}

const TBody = TBodyInner as <TData>(p: TBodyProps<TData>) => React.JSX.Element
export default TBody
