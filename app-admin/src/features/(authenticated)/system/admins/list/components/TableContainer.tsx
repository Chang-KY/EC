'use client'

import React from 'react'
import Table, { TableChange } from '@/components/table/Table'
import Pagination from '@/components/pagination/Pagination'
import { adminColumns } from '@/features/(authenticated)/system/admins/list/adminColumns'
import { ADMINS_TABLE } from '@/types/db'
import { useKeywordSetParam } from '@/hooks/params/useKeywordSetParam'
import { usePageSetParam } from '@/hooks/params/usePageSetParam'
import { useOrderSortParam } from '@/hooks/params/useOrderSortParams'
import { useAdmins } from '@/features/(authenticated)/system/admins/list/useAdmins'
import Input from '@/components/ui/Input'
import { CirclePlus, Search } from 'lucide-react'
import Button from '@/components/ui/button/Button'

export default function TableContainer() {
  const { keyword, setKeyword, debouncedSearchTerm, isDebouncing, flush } = useKeywordSetParam(700)
  const { page, setPage, pageSize, setPageSize, sizes } = usePageSetParam(10)
  const { sorting, setSorting, orderBy, order, sortParam, setOrder } = useOrderSortParam<
    ADMINS_TABLE['Row']
  >({
    defaultId: 'id',
    defaultDesc: true,
    allowedKeys: ['id', 'email', 'name', 'status', 'permissions', 'last_login', 'role'],
  })

  const { data, isFetching } = useAdmins({
    page,
    size: pageSize,
    orderBy,
    order,
    keyword: debouncedSearchTerm,
  })
  const items = data?.items ?? []
  const total = data?.total ?? 0

  const handleTableChange = (next: TableChange) => {
    if (next.page) setPage(next.page)
    if (next.sorting) setSorting(next.sorting)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Input
          type="text"
          name="search"
          value={keyword}
          placeholder="어드민 검색..."
          icon={<Search size={16} />}
          onKeyDown={(e) => {
            if (e.key === 'Enter') flush() // Enter 시 즉시 검색 반영
          }}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button icon={<CirclePlus size={14} className="text-gray-700" />}>관리자 추가</Button>
      </div>
      <Table<ADMINS_TABLE['Row']>
        data={items}
        total={total}
        page={page}
        pageSize={pageSize}
        sorting={sorting}
        emptyText="Admins Data가 없습니다."
        onChange={handleTableChange}
        loading={isFetching}
        rowKey={(r) => String(r.id)}
        getRowHref={(r) => `/admin/coupons/detail/${r.id}`}
        manualSorting
        manualPagination
        columns={adminColumns}
      />
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onChange={(p) => {}}
        onPageSizeChange={() => {}}
        itemsType="Admins"
      />
    </div>
  )
}
