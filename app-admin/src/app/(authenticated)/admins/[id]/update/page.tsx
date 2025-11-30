import React from 'react'
import { fetchRowByColumn } from '@/lib/db/fetchRowById'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const admin = await fetchRowByColumn('admins', 'id', id, ['name', 'email'] as const)
  if (!admin) {
    return {
      title: '관리자 계정을 찾을 수 없음 | Admin',
      description: '요청하신 관리자 계정 정보를 찾을 수 없습니다.',
    }
  }
  const displayName = admin.name ?? admin.email
  return {
    title: `${displayName} | 관리자 정보 수정 | Admin`,
    description: `EC Admin에서 ${displayName} 관리자 계정의 정보와 권한을 수정하는 페이지입니다.`,
  }
}
const AdminUpdatePage = () => {
  return <div></div>
}

export default AdminUpdatePage
