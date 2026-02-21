'use client'

import React from 'react'
import Table, { TableChange } from '@/components/table/Table'
import Pagination from '@/components/pagination/Pagination'
import { USERS_TABLE } from '@/types/db'
import { useKeywordSetParam } from '@/hooks/params/useKeywordSetParam'
import type { paginationOptions } from '@/types/PaginationOptions'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { usePagination } from '@/hooks/usePagination'
import { useOrderSort } from '@/hooks/useOrderSort'
import { useSetQuery } from '@/hooks/useSetQuery'
import { usePageSize } from '@/hooks/usePageSize'
import SearchBar from '@/components/ui/SearchBar'
import { getUsers } from '@/features/(authenticated)/commerce/users/list/getUsers'
import { userColumns } from '@/features/(authenticated)/commerce/users/list/userColumns'

export default function UserTableContainer({
  page: initialPage,
  size: initialSize,
  orderBy: initialOrderBy,
  order: initialOrder,
  keyword: initialKeyword,
}: paginationOptions<USERS_TABLE['Row']>) {
  const { keyword, setKeyword, debouncedSearchTerm, isDebouncing, flush } = useKeywordSetParam(
    700,
    initialKeyword,
  )
  const { page, setPage } = usePagination(initialPage)
  const { sorting, setSorting, order, orderBy } = useOrderSort<USERS_TABLE['Row']>({
    defaultId: initialOrderBy ?? 'id',
    defaultDesc: initialOrder === 'desc',
    allowedKeys: ['id', 'name', 'email', 'created_at', 'avatar_url'],
  })
  const { size, setSize, sizeList } = usePageSize(initialSize)
  const { setQuery } = useSetQuery()
  const { data, isFetching } = useQuery({
    ...getUsers({
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
        <SearchBar
          isSearching={isSearching}
          searchLabel={searchLabel}
          setKeyword={setKeyword}
          keyword={keyword}
          flush={flush}
          placeholder="회원 검색..."
        />
      </div>

      <Table<USERS_TABLE['Row']>
        data={items}
        total={total}
        page={page}
        pageSize={size ?? sizeList[0]}
        sorting={sorting}
        emptyText={`${debouncedSearchTerm ? `[${debouncedSearchTerm}]` : ''} User Data가 없습니다.`}
        onChange={handleTableChange}
        loading={isFetching}
        rowKey={(r) => String(r.id)}
        getRowHref={(r) => `/commerce/users/${r.id}`}
        manualSorting
        manualPagination
        columns={userColumns}
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
        itemsType="Users"
      />
    </div>
  )
}
