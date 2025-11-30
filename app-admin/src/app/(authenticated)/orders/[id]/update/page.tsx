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
    title: `주문 #${id} | 주문 정보 수정 | Admin`,
    description: `주문 상태(${meta.status}) 및 관련 정보를 수정하는 페이지입니다.`,
  }
}

const OrderUpdatePage = () => {
  return <div></div>
}

export default OrderUpdatePage
