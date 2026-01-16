import React from 'react'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'
import Section from '@/components/layout/Section'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { pageSizeList } from '@/constants/page/pageSizeList'
import { CATEGORIES_TABLE } from '@/types/db'
import { getQueryClient } from '@/lib/query/getQueryClient'
import { SearchParams } from '@/types/SearchParams'
import CategoryTableContainer from '@/features/(authenticated)/commerce/categories/components/CategoryTableContainer'
import { getCategories } from '@/features/(authenticated)/commerce/categories/list/getCategories'

export const metadata: Metadata = {
  title: '카테고리 관리 | Admin',
  description: '상품 카테고리 구조를 생성·편집하고 노출 순서와 계층 구조를 관리하는 페이지입니다.',
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const page = Number(sp.page ?? '1')
  const size = Number(sp.size ?? String(pageSizeList[0]))
  const orderBy = (sp.orderBy ?? 'id') as keyof CATEGORIES_TABLE['Row']
  const order = (sp.order ?? 'asc') as 'asc' | 'desc'
  const keyword = sp.keyword ?? ''

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(
    getCategories({
      page,
      size,
      keyword,
      order,
      orderBy,
    }),
  )

  return (
    <Section pathTitle={ROUTES.CATEGORIES}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategoryTableContainer
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
