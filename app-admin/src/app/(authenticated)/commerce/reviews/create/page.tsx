import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '관리자 계정 관리 | Admin',
  description: 'EC Admin에서 관리자 계정을 조회하고 역할과 권한을 관리하는 페이지입니다.',
}

const ReviewCreatePage = () => {
  return (
    <section>
      <PageTitle pathName="/admins">
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default ReviewCreatePage
