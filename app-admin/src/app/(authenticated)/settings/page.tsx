import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/button/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '설정 | Admin',
  description:
    '상점 정보, 결제·배송 옵션, 보안 정책 등 EC Admin 전반의 환경 설정을 관리하는 페이지입니다.',
}

const SettingsPage = () => {
  return (
    <section>
      <PageTitle pathName="/admins">
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default SettingsPage
