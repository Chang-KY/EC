import React from 'react'
import { fetchRowByColumn } from '@/lib/db/fetchRowById'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  const meta = await fetchRowByColumn('profiles', 'id', id, ['name', 'email'] as const)

  if (!meta) {
    return {
      title: '사용자를 찾을 수 없음 | Admin',
      description: '요청하신 사용자 프로필 정보를 찾을 수 없습니다.',
    }
  }

  const displayName = meta.name ?? meta.email

  return {
    title: `${displayName} | 사용자 상세 | Admin`,
    description: `${displayName} 사용자의 기본 정보와 활동 현황을 확인하는 페이지입니다.`,
  }
}

const UserDetailPage = () => {
  return <div></div>
}

export default UserDetailPage
