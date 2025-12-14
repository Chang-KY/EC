import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '쿠폰 생성 | Admin',
  description:
    '할인 유형, 적용 대상, 사용 조건과 유효 기간을 설정하여 새 프로모션 쿠폰을 생성하는 페이지입니다.',
}

const CouponCreatePage = () => {
  return (
    <section>
      <PageTitle pathName="/admins">
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default CouponCreatePage
