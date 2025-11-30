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

  const meta = await fetchRowByColumn('products', 'id', numericId, ['name', 'description'] as const)

  if (!meta) {
    return {
      title: '상품을 찾을 수 없음 | Admin',
      description: '요청하신 상품 정보를 찾을 수 없습니다.',
    }
  }

  return {
    title: `${meta.name} | 상품 수정 | Admin`,
    description:
      meta.description ?? `${meta.name} 상품의 기본 정보와 판매 설정을 수정하는 페이지입니다.`,
  }
}

const ProductUpdatePage = () => {
  return <div></div>
}

export default ProductUpdatePage
