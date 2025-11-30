import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/button/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '알림 생성 | Admin',
  description:
    '이메일, 푸시, SMS 등의 발송 채널과 타겟, 발송 시점과 메시지 내용을 설정하여 새로운 알림을 생성하는 페이지입니다.',
}

const NotificationCreatePage = () => {
  return (
    <section>
      <PageTitle pathName="/admins">
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default NotificationCreatePage
