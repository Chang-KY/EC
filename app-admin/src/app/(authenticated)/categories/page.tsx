import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/button/Button'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'

export const metadata: Metadata = {
  title: '카테고리 관리 | Admin',
  description: '상품 카테고리 구조를 생성·편집하고 노출 순서와 계층 구조를 관리하는 페이지입니다.',
}

const CategoriesPage = () => {
  return (
    <section>
      <PageTitle pathName={ROUTES.CATEGORIES}>
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default CategoriesPage
