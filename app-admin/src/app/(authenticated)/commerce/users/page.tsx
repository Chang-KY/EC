import React from 'react'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'
import { SearchParams } from '@/types/SearchParams'
import { pageSizeList } from '@/constants/page/pageSizeList'
import { USERS_TABLE } from '@/types/db'
import { getQueryClient } from '@/lib/query/getQueryClient'
import Section from '@/components/layout/Section'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getUsers } from '@/features/(authenticated)/commerce/users/list/getUsers'
import UserTableContainer from '@/features/(authenticated)/commerce/users/components/UserTableContainer'

export const metadata: Metadata = {
  title: '회원 관리 | Admin',
  description:
    '서비스 이용자 계정 정보를 조회하고 상태, 등급 등을 관리하는 페이지입니다.',
}

export default async function UserListPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const page = Number(sp.page ?? '1')
  const size = Number(sp.size ?? String(pageSizeList[0]))
  const orderBy = (sp.orderBy ?? 'id') as keyof USERS_TABLE['Row']
  const order = (sp.order ?? 'asc') as 'asc' | 'desc'
  const keyword = sp.keyword ?? ''

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(
    getUsers({
      page,
      size,
      keyword,
      order,
      orderBy,
    }),
  )

  return (
    <Section pathTitle={ROUTES.USERS}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserTableContainer
          page={page}
          size={size}
          orderBy={orderBy}
          order={order}
          keyword={keyword}
        />
      </HydrationBoundary>
    </Section>
  )
}
