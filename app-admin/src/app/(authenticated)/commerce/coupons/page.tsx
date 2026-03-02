import React from 'react'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'
import { SearchParams } from '@/types/SearchParams'
import { PAGE_SIZE_LIST } from '@/constants/page/PAGE_SIZE_LIST'
import { COUPONS_TABLE } from '@/types/db'
import { getQueryClient } from '@/lib/query/getQueryClient'
import Section from '@/components/layout/Section'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getCoupons } from '@/features/(authenticated)/commerce/coupons/list/getCoupons'
import CouponTableContainer from '@/features/(authenticated)/commerce/coupons/components/CouponTableContainer'

export const metadata: Metadata = {
  title: '쿠폰 관리 | Admin',
  description:
    '할인 쿠폰과 프로모션을 생성·수정하고 발급 현황과 사용 내역을 관리하는 페이지입니다.',
}

export default async function CouponListPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const page = Number(sp.page ?? '1')
  const size = Number(sp.size ?? String(PAGE_SIZE_LIST[0]))
  const orderBy = (sp.orderBy ?? 'id') as keyof COUPONS_TABLE['Row']
  const order = (sp.order ?? 'asc') as 'asc' | 'desc'
  const keyword = sp.keyword ?? ''

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(
    getCoupons({
      page,
      size,
      keyword,
      order,
      orderBy,
    }),
  )

  return (
    <Section pathTitle={ROUTES.COUPONS}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CouponTableContainer
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
