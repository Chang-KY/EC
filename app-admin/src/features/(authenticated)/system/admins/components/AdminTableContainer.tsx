'use client'

import React from 'react'
import Table, { TableChange } from '@/components/table/Table'
import Pagination from '@/components/pagination/Pagination'
import { adminColumns } from '@/features/(authenticated)/system/admins/list/adminColumns'
import { ADMINS_TABLE } from '@/types/db'
import { useKeywordSetParam } from '@/hooks/params/useKeywordSetParam'
import Input from '@/components/ui/Input'
import { CirclePlus, Search, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import type { paginationOptions } from '@/types/pagination'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAdmins } from '@/features/(authenticated)/system/admins/list/getAdmins'
import { usePagination } from '@/hooks/usePagination'
import { useOrderSort } from '@/hooks/useOrderSort'
import { useSetQuery } from '@/hooks/useSetQuery'
import { usePageSize } from '@/hooks/usePageSize'

export default function AdminTableContainer({
  page: initialPage,
  size: initialSize,
  orderBy: initialOrderBy,
  order: initialOrder,
  keyword: initialKeyword,
}: paginationOptions<ADMINS_TABLE['Row']>) {
  const { keyword, setKeyword, debouncedSearchTerm, isDebouncing, flush } = useKeywordSetParam(
    700,
    initialKeyword,
  )
  const { page, setPage } = usePagination(initialPage)
  const { sorting, setSorting, order, orderBy } = useOrderSort<ADMINS_TABLE['Row']>({
    defaultId: initialOrderBy ?? 'id',
    defaultDesc: initialOrder === 'desc',
    allowedKeys: ['id', 'email', 'name', 'status', 'level', 'role', 'last_login'],
  })
  const { size, setSize, sizeList } = usePageSize(initialSize)
  const { setQuery } = useSetQuery()
  const { data, isFetching } = useQuery({
    ...getAdmins({
      page,
      size,
      keyword: debouncedSearchTerm,
      order,
      orderBy,
    }),
    placeholderData: keepPreviousData,
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const isSearchTyping = keyword !== debouncedSearchTerm
  const isSearching = isDebouncing || isFetching
  const searchLabel =
    isDebouncing || isSearchTyping ? '입력 반영 중…' : isFetching ? '검색 중…' : ''

  const handleTableChange = (next: TableChange) => {
    const patch: Record<string, string | number | null> = {}

    if (typeof next.page === 'number') {
      setPage(next.page)
      patch.page = next.page
    }

    if (next.sorting) {
      setSorting(next.sorting)

      const first = next.sorting[0]
      if (!first) {
        patch.orderBy = null
        patch.order = null
      } else {
        patch.orderBy = first.id
        patch.order = first.desc ? 'desc' : 'asc'
        patch.page = 1
        setPage(1)
      }
    }

    setQuery(patch, { scroll: false })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            name="search"
            className="h-7"
            value={keyword}
            placeholder="어드민 검색..."
            icon={
              isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') flush()
            }}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {isSearching && <span className="text-xs text-gray-500">{searchLabel}</span>}
        </div>
        <Link href="/system/admins/create">
          <Button icon={<CirclePlus size={14} className="text-gray-700" />}>관리자 추가</Button>
        </Link>
      </div>

      <Table<ADMINS_TABLE['Row']>
        data={items}
        total={total}
        page={page}
        pageSize={size ?? sizeList[0]}
        sorting={sorting}
        emptyText={`${debouncedSearchTerm ? `[${debouncedSearchTerm}]` : ''} Admins Data가 없습니다.`}
        onChange={handleTableChange}
        loading={isFetching}
        rowKey={(r) => String(r.id)}
        getRowHref={(r) => `/system/admins/${r.id}`}
        manualSorting
        manualPagination
        columns={adminColumns}
      />
      <Pagination
        page={page}
        pageSize={size ?? sizeList[0]}
        sizes={sizeList}
        total={total}
        onChange={(p) => {
          setPage(p)
          setQuery({ page: p })
        }}
        onPageSizeChange={(s) => {
          setPage(1)
          setSize(s)
          setQuery({ size: s, page: 1 })
        }}
        itemsType="Admins"
      />
    </div>
  )
}
