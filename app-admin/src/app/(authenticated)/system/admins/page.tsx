import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'
import TableContainer from '@/features/(authenticated)/system/admins/components/TableContainer'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { SearchParams } from '@/types/SearchParams'
import { ADMINS_TABLE } from '@/types/db'
import { getAdmins } from '@/features/(authenticated)/system/admins/list/getAdmins'
import { getQueryClient } from '@/provider/TanStackProviders'

export const metadata: Metadata = {
  title: '관리자 계정 관리 | Admin',
  description: 'EC Admin에서 관리자 계정을 조회하고 역할과 권한을 관리하는 페이지입니다.',
}

export default async function AdminsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const page = Number(sp.page ?? '1')
  const sizeTotal = [7, 14, 28, 50]
  const size = sizeTotal[0]
  const orderBy = (sp.orderBy ?? 'name') as keyof ADMINS_TABLE['Row']
  const order = (sp.order ?? 'asc') as 'asc' | 'desc'
  const keyword = ''
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
  const dehydratedState = dehydrate(queryClient)

  return (
    <section>
      <PageTitle pathName={ROUTES.ADMINS} />
      <div className="px-20">
        <HydrationBoundary state={dehydratedState}>
          <TableContainer
            page={page}
            size={size}
            keyword={keyword}
            order={order}
            orderBy={orderBy}
            sizeTotal={sizeTotal}
          />
        </HydrationBoundary>
      </div>
    </section>
  )
}
