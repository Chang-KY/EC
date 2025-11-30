import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/button/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '파일 관리 | Admin',
  description:
    '상품 이미지, 배너, 첨부 파일 등 업로드된 리소스를 관리하고 정리하는 파일 관리 페이지입니다.',
}

const NotificationsPage = () => {
  return (
    <section>
      <PageTitle pathName="/admins">
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default NotificationsPage
