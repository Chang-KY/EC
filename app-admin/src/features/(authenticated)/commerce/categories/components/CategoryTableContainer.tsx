'use client'

import React from 'react'
import Table, { TableChange } from '@/components/table/Table'
import Pagination from '@/components/pagination/Pagination'
import { CATEGORIES_TABLE } from '@/types/db'
import { useKeywordSetParam } from '@/hooks/params/useKeywordSetParam'
import Input from '@/components/ui/Input'
import { CirclePlus, Search, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import type { paginationOptions } from '@/types/PaginationOptions'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { usePagination } from '@/hooks/usePagination'
import { useOrderSort } from '@/hooks/useOrderSort'
import { useSetQuery } from '@/hooks/useSetQuery'
import { usePageSize } from '@/hooks/usePageSize'
import { categoryColumns } from '@/features/(authenticated)/commerce/categories/list/categoryColumns'
import { getCategories } from '@/features/(authenticated)/commerce/categories/list/getCategories'

export default function CategoryTableContainer({
  page: initialPage,
  size: initialSize,
  orderBy: initialOrderBy,
  order: initialOrder,
  keyword: initialKeyword,
}: paginationOptions<CATEGORIES_TABLE['Row']>) {
  const { keyword, setKeyword, debouncedSearchTerm, isDebouncing, flush } = useKeywordSetParam(
    700,
    initialKeyword,
  )
  const { page, setPage } = usePagination(initialPage)
  const { sorting, setSorting, order, orderBy } = useOrderSort<CATEGORIES_TABLE['Row']>({
    defaultId: initialOrderBy ?? 'id',
    defaultDesc: initialOrder === 'desc',
    allowedKeys: ['id', 'name', 'slug', 'parent_id', 'path', 'depth', 'selectable'],
  })
  const { size, setSize, sizeList } = usePageSize(initialSize)
  const { setQuery } = useSetQuery()
  const { data, isFetching } = useQuery({
    ...getCategories({
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
            placeholder="카테고리 검색..."
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
        <Link href="/commerce/categories/create">
          <Button icon={<CirclePlus size={14} className="text-gray-700" />}>카테고리 추가</Button>
        </Link>
      </div>

      <Table<CATEGORIES_TABLE['Row']>
        data={items}
        total={total}
        page={page}
        pageSize={size ?? sizeList[0]}
        sorting={sorting}
        emptyText={`${debouncedSearchTerm ? `[${debouncedSearchTerm}]` : ''} Categories Data가 없습니다.`}
        onChange={handleTableChange}
        loading={isFetching}
        rowKey={(r) => String(r.id)}
        getRowHref={(r) => `/commerce/categories/${r.id}`}
        manualSorting
        manualPagination
        columns={categoryColumns}
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
        itemsType="Categories"
      />
    </div>
  )
}
