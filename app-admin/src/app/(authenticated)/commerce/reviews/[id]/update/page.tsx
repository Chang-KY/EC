import React from 'react'
import type { Metadata } from 'next'
import { fetchRowByColumn } from '@/lib/db/fetchRowById'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const numericId = Number(id)

  const meta = await fetchRowByColumn('product_comments', 'id', numericId, [
    'content',
    'rating',
  ] as const)

  if (!meta) {
    return {
      title: '리뷰를 찾을 수 없음 | Admin',
      description: '요청하신 상품 리뷰 정보를 찾을 수 없습니다.',
    }
  }

  const shortContent =
    meta.content && meta.content.length > 20
      ? meta.content.slice(0, 20) + '…'
      : (meta.content ?? '상품 리뷰')

  return {
    title: `${shortContent} | 리뷰 수정 | Admin`,
    description:
      meta.content ?? `별점 ${meta.rating}점으로 작성된 상품 리뷰 내용을 수정하는 페이지입니다.`,
  }
}

const ReviewUpdatePage = () => {
  return <div></div>
}

export default ReviewUpdatePage
