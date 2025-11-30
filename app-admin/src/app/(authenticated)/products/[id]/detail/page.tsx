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
    title: `${meta.name} | 상품 상세 | Admin`,
    description: meta.description ?? `${meta.name} 상품의 상세 정보를 확인하는 페이지입니다.`,
  }
}

const ProductDetailPage = () => {
  return <div></div>
}

export default ProductDetailPage
