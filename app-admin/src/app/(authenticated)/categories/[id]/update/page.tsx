import React from 'react'
import { fetchRowByColumn } from '@/lib/db/fetchRowById'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const numericId = Number(id)

  const meta = await fetchRowByColumn('categories', 'id', numericId, ['name', 'slug'] as const)

  if (!meta) {
    return {
      title: '카테고리를 찾을 수 없음 | Admin',
      description: '요청하신 카테고리 정보를 찾을 수 없습니다.',
    }
  }

  return {
    title: `${meta.name} | 카테고리 수정 | Admin`,
    description: `EC Admin에서 ${meta.name} 카테고리의 이름, 슬러그, 계층 구조를 수정하는 페이지입니다.`,
  }
}

const CategoryUpdatePage = () => {
  return <div></div>
}

export default CategoryUpdatePage
