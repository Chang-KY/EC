import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/button/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '분석 | Admin',
  description:
    '기간별 매출, 주문, 유입 경로 등 주요 지표를 분석하고 리포트를 확인하는 페이지입니다.',
}

const AnalyticsPage = () => {
  return (
    <section>
      <PageTitle pathName="/admins">
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default AnalyticsPage
