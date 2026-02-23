import React from 'react'
import { Metadata } from 'next'
import Section from '@/components/layout/Section'
import { ROUTES } from '@/constants/routes'
import CouponCreateForm from '@/features/(authenticated)/commerce/coupons/components/CouponCreateForm'

export const metadata: Metadata = {
  title: '쿠폰 생성 | Admin',
  description:
    '할인 유형, 적용 대상, 사용 조건과 유효 기간을 설정하여 새 프로모션 쿠폰을 생성하는 페이지입니다.',
}

export default async function CouponCreatePage() {
  return (
    <Section pathTitle={`${ROUTES.COUPONS}/create`}>
      <CouponCreateForm />
    </Section>
  )
}
