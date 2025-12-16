import React from 'react'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'
import Section from '@/components/layout/Section'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import TableContainer from '@/features/(authenticated)/system/admins/components/TableContainer'
import { pageSize } from '@/constants/page/pageSize'

export const metadata: Metadata = {
  title: '상품 관리 | Admin',
  description:
    '상품 기본 정보, 옵션, 가격, 재고를 등록·수정하고 판매 상태를 관리하는 상품 관리 페이지입니다.',
}

export default async function ProductsPage() {
  return (
    <Section pathTitle={ROUTES.PRODUCTS}>
      {/*<HydrationBoundary state={dehydrate(queryClient)}>*/}
      {/*  <TableContainer*/}
      {/*    page={page}*/}
      {/*    size={size}*/}
      {/*    keyword={keyword}*/}
      {/*    order={order}*/}
      {/*    orderBy={orderBy}*/}
      {/*    sizeTotal={pageSize}*/}
      {/*  />*/}
      {/*</HydrationBoundary>*/}
    </Section>
  )
}
