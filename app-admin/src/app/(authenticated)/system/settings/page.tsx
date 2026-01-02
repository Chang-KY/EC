import React from 'react'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'
import Section from '@/components/layout/Section'
import CreateLoading from '@/components/loading/CreateLoading'
import DetailLoading from '@/components/loading/DetailLoading'

export const metadata: Metadata = {
  title: '설정 | Admin',
  description:
    '상점 정보, 결제·배송 옵션, 보안 정책 등 EC Admin 전반의 환경 설정을 관리하는 페이지입니다.',
}

const SettingsPage = () => {
  // return <Section pathTitle={ROUTES.ADMINS}></Section>
  return <DetailLoading />
}

export default SettingsPage
