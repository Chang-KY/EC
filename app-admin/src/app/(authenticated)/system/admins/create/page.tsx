import React from 'react'
import { Metadata } from 'next'
import PageTitle from '@/components/layout/PageTitle'
import { ROUTES } from '@/constants/routes'
import AdminsForm from '@/features/(authenticated)/system/admins/components/AdminsForm'

export const metadata: Metadata = {
  title: '관리자 계정 생성 | Admin',
  description:
    'EC Admin에 접근할 새 관리자 계정을 생성하고 역할(Role)과 세부 권한을 설정하는 페이지입니다.',
}

const AdminCreatePage = () => {
  return (
    <section>
      <PageTitle pathName={`${ROUTES.ADMINS}/create`} />

      <div className="px-20">
        <AdminsForm />
      </div>
    </section>
  )
}

export default AdminCreatePage
