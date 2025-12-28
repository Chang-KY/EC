import React from 'react'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'
import TableContainer from '@/features/(authenticated)/system/admins/components/TableContainer'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { SearchParams } from '@/types/SearchParams'
import { ADMINS_TABLE } from '@/types/db'
import { getAdmins } from '@/features/(authenticated)/system/admins/list/getAdmins'
import { getQueryClient } from '@/lib/query/getQueryClient'
import { pageSizeList } from '@/constants/page/pageSizeList'
import Section from '@/components/layout/Section'

export const metadata: Metadata = {
  title: '관리자 계정 관리 | Admin',
  description: 'EC Admin에서 관리자 계정을 조회하고 역할과 권한을 관리하는 페이지입니다.',
}

export default async function AdminsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const page = Number(sp.page ?? '1')
  const size = Number(sp.size ?? String(pageSizeList[0]))
  const orderBy = (sp.orderBy ?? 'id') as keyof ADMINS_TABLE['Row']
  const order = (sp.order ?? 'asc') as 'asc' | 'desc'
  const keyword = sp.keyword ?? ''

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(
    getAdmins({
      page,
      size,
      keyword,
      order,
      orderBy,
    }),
  )
  console.log('AdminsPage rendered with searchParams:', sp)

  return (
    <Section pathTitle={ROUTES.ADMINS}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TableContainer page={page} size={size} orderBy={orderBy} order={order} keyword={keyword} />
      </HydrationBoundary>
    </Section>
  )
}
