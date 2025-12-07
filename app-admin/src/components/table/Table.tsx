'use client'

import THead from '@/components/table/THead'
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import TBody from '@/components/table/TBody'
import clsx from 'clsx'

export type TableChange = {
  page?: number
  pageSize?: number
  sorting?: SortingState
  filters?: Record<string, string>
}

type Props<TData> = {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  total: number // 전체 건수
  page: number // 페이지는 1
  pageSize: number
  sorting?: SortingState
  onChange: (next: TableChange) => void
  loading?: boolean
  emptyText?: string
  className?: string
  rowKey?: (row: TData) => string // 고유 키
  getRowHref?: (row: TData) => string | undefined
  manualSorting?: boolean // 서버 정렬일 때 true
  manualPagination?: boolean // 서버 페이징일 때 true
}

const ROW_HEIGHT = 40 // px

export default function Table<TData>({
  columns,
  data,
  total,
  page,
  pageSize,
  sorting = [],
  onChange,
  loading,
  emptyText = '데이터가 없습니다.',
  className,
  rowKey,
  getRowHref,
  manualSorting = true,
  manualPagination = true,
}: Props<TData>) {
  const table = useReactTable<TData>({
    columns,
    data,
    manualSorting,
    manualPagination,
    state: { sorting },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      onChange({ sorting: next as SortingState, page: 1 }) // 정렬 바뀌면 1페이지로
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  })
  const height = `${ROW_HEIGHT * pageSize}px`
  const divineHeaderHeight = `${ROW_HEIGHT * pageSize - 34}px`

  return (
    <div className="w-full rounded border border-gray-300 dark:border-gray-800" style={{ height }}>
      <table className="relative w-max min-w-full border-separate border-spacing-0 divide-y divide-gray-300">
        <THead table={table} />
        <TBody
          height={divineHeaderHeight}
          table={table}
          data={data}
          loading={loading}
          emptyText={emptyText}
          getRowKey={rowKey}
          getRowHref={getRowHref}
        />
        <tfoot></tfoot>
      </table>
    </div>
  )
}
