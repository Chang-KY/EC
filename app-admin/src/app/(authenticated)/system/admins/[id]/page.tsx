import React from 'react'
import { fetchRowByColumn } from '@/lib/db/fetchRowById'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const meta = await fetchRowByColumn('admins', 'id', id, ['name', 'email'] as const)
  if (!meta) {
    return {
      title: '관리자 계정을 찾을 수 없음 | Admin',
      description: '요청하신 관리자 계정 정보를 찾을 수 없습니다.',
    }
  }
  const displayName = meta.name ?? meta.email
  return {
    title: `${displayName} | 관리자 상세 | Admin`,
    description: `EC Admin에서 ${displayName} 관리자 계정의 상세 정보를 확인하는 페이지입니다.`,
  }
}

const AdminDetailPage = () => {
  return <div></div>
}

export default AdminDetailPage
