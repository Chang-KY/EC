import React from 'react'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'
import Section from '@/components/layout/Section'
import CategoryCreateForm from '@/features/(authenticated)/commerce/categories/components/CategoryCreateForm'

export const metadata: Metadata = {
  title: '카테고리 생성 | Admin',
  description:
    '상품을 그룹화할 카테고리 이름, 슬러그, 상위 카테고리 및 노출 순서를 설정하는 페이지입니다.',
}

const CategoryCreatePage = () => {
  return (
    <Section pathTitle={`${ROUTES.CATEGORIES}/create`}>
      <CategoryCreateForm />
    </Section>
  )
}

export default CategoryCreatePage
