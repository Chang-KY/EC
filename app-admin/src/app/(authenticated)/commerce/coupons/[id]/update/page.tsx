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

  const meta = await fetchRowByColumn('coupons', 'id', numericId, [
    'name',
    'description',
    'discount_type',
    'discount_value',
  ] as const)

  if (!meta) {
    return {
      title: '쿠폰을 찾을 수 없음 | Admin',
      description: '요청하신 쿠폰 정보를 찾을 수 없습니다.',
    }
  }
  const discountType = meta.discount_type === 'fixed' ? '정액' : '정률'
  return {
    title: `${meta.name} | 쿠폰 수정 | Admin`,
    description:
      meta.description ??
      `${discountType} 타입의 ${meta.discount_value} 할인 해주는 쿠폰 정보를 수정하는 페이지입니다.`,
  }
}

const CouponUpdatePage = () => {
  return <div></div>
}

export default CouponUpdatePage
