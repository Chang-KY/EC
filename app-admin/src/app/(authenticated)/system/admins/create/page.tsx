import React from 'react'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'
import AdminCreateForm from '@/features/(authenticated)/system/admins/components/AdminCreateForm'
import Section from '@/components/layout/Section'

export const metadata: Metadata = {
  title: '관리자 계정 생성 | Admin',
  description:
    'EC Admin에 접근할 새 관리자 계정을 생성하고 역할(Role)과 세부 권한을 설정하는 페이지입니다.',
}

const AdminCreatePage = () => {
  return (
    <Section pathTitle={`${ROUTES.ADMINS}/create`}>
      <AdminCreateForm />
    </Section>
  )
}

export default AdminCreatePage
