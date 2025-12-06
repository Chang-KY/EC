import React from 'react'
import { fetchRowByColumn } from '@/lib/db/fetchRowById'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const numericId = Number(id)

  const meta = await fetchRowByColumn('orders', 'id', numericId, ['total_price', 'status'] as const)

  if (!meta) {
    return {
      title: '주문을 찾을 수 없음 | Admin',
      description: '요청하신 주문 정보를 찾을 수 없습니다.',
    }
  }

  return {
    title: `주문 #${id} | 주문 상세 | Admin`,
    description: `주문 상태(${meta.status})와 결제·배송 정보를 확인하는 페이지입니다.`,
  }
}

const OrderDetailPage = () => {
  return <div></div>
}

export default OrderDetailPage
