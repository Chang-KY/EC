import React from 'react'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'
import Section from '@/components/layout/Section'
import { pageSizeList } from '@/constants/page/pageSizeList'
import { PRODUCTS_TABLE } from '@/types/db'
import { getQueryClient } from '@/lib/query/getQueryClient'
import { SearchParams } from '@/types/SearchParams'
import { getProducts } from '@/features/(authenticated)/commerce/products/list/getProducts'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import ProductTableContainer from '@/features/(authenticated)/commerce/products/components/ProductTableContainer'

export const metadata: Metadata = {
  title: '상품 관리 | Admin',
  description:
    '상품 기본 정보, 옵션, 가격, 재고를 등록·수정하고 판매 상태를 관리하는 상품 관리 페이지입니다.',
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const page = Number(sp.page ?? '1')
  const size = Number(sp.size ?? String(pageSizeList[0]))
  const orderBy = (sp.orderBy ?? 'id') as keyof PRODUCTS_TABLE['Row']
  const order = (sp.order ?? 'asc') as 'asc' | 'desc'
  const keyword = sp.keyword ?? ''

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(
    getProducts({
      page,
      size,
      keyword,
      order,
      orderBy,
    }),
  )

  return (
    <Section pathTitle={ROUTES.PRODUCTS}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductTableContainer
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
