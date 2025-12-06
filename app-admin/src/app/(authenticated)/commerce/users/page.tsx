import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/button/Button'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'

export const metadata: Metadata = {
  title: '사용자 관리 | Admin',
  description:
    '서비스 이용자 계정 정보를 조회하고 상태, 등급, 접근 권한 등을 관리하는 페이지입니다.',
}

const UsersPage = () => {
  return (
    <section>
      <PageTitle pathName={ROUTES.USERS}>
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default UsersPage
