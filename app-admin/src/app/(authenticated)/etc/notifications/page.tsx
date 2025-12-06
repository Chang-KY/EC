import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/button/Button'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'

export const metadata: Metadata = {
  title: '알림 관리 | Admin',
  description:
    '이메일, 푸시, SMS 등 발송 알림을 설정하고 발송 결과 및 이력을 모니터링하는 페이지입니다.',
}

const NotificationsPage = () => {
  return (
    <section>
      <PageTitle pathName={ROUTES.NOTIFICATIONS}>
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default NotificationsPage
