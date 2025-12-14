import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/Button'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'

export const metadata: Metadata = {
  title: '리뷰 관리 | Admin',
  description:
    '상품 리뷰를 조회하고 노출·숨김, 신고 처리 등 리뷰 정책과 품질을 관리하는 페이지입니다.',
}

const ReviewsPage = () => {
  return (
    <section>
      <PageTitle pathName={ROUTES.REVIEWS}>
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default ReviewsPage
