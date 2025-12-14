import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '상품 등록 | Admin',
  description: '새로운 상품의 기본 정보, 옵션, 가격, 재고와 노출 상태를 등록하는 페이지입니다.',
}

const ProductCreatePage = () => {
  return (
    <section>
      <PageTitle pathName="/admins">
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default ProductCreatePage
