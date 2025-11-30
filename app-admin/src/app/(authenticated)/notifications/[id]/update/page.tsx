import React from 'react'
import { fetchRowByColumn } from '@/lib/db/fetchRowById'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const numericId = Number(id)
  const meta = await fetchRowByColumn('products', 'id', numericId, ['name', 'description'] as const)
  if (!meta) return { title: '상품을 찾을 수 없음' }
  return {
    title: `${meta.name} | Detail | Product | Admin`,
    description: meta.description ?? undefined,
  }
}
const NotificationUpdatePage = () => {
  return <div></div>
}

export default NotificationUpdatePage
