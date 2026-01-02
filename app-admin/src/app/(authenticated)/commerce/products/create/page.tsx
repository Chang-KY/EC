import React from 'react'
import { Metadata } from 'next'
import Section from '@/components/layout/Section'
import { ROUTES } from '@/constants/routes'
import ProductCreateForm from '@/features/(authenticated)/commerce/products/components/ProductCreateForm'

export const metadata: Metadata = {
  title: '상품 등록 | Admin',
  description: '새로운 상품의 기본 정보, 옵션, 가격, 재고와 노출 상태를 등록하는 페이지입니다.',
}

export default async function ProductCreatePage() {
  return (
    <Section pathTitle={`${ROUTES.PRODUCTS}/create`}>
      <ProductCreateForm />
    </Section>
  )
}
