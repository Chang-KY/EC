import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/button/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '카테고리 생성 | Admin',
  description:
    '상품을 그룹화할 카테고리 이름, 슬러그, 상위 카테고리 및 노출 순서를 설정하는 페이지입니다.',
}

const CategoryCreatePage = () => {
  return (
    <section>
      <PageTitle pathName="/admins">
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default CategoryCreatePage
