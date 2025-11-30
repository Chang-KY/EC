import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/button/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '상품 관리 | Admin',
  description:
    '상품 기본 정보, 옵션, 가격, 재고를 등록·수정하고 판매 상태를 관리하는 상품 관리 페이지입니다.',
}

const ProductsPage = () => {
  return (
    <section>
      <PageTitle pathName="/admins">
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default ProductsPage
