import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/button/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '주문 관리 | Admin',
  description:
    '주문 내역을 조회하고 결제 상태, 배송 진행, 취소·환불을 관리하는 주문 운영 페이지입니다.',
}

const OrdersPage = () => {
  return (
    <section>
      <PageTitle pathName="/admins">
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default OrdersPage
