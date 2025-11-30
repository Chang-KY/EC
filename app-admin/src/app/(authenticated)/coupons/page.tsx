import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/button/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '쿠폰 관리 | Admin',
  description:
    '할인 쿠폰과 프로모션을 생성·수정하고 발급 현황과 사용 내역을 관리하는 페이지입니다.',
}

const CouponsPage = () => {
  return (
    <section>
      <PageTitle pathName="/admins">
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default CouponsPage
