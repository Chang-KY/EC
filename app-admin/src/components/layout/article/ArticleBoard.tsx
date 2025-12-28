'use client'

import { articleButtonAtom } from '@/store/articleEditAtoms'
import { useAtomValue } from 'jotai'
import React from 'react'

export default function ArticleBoard({
  id,
  boardContent,
}: {
  id?: string
  boardContent?: Record<string, React.ReactNode>
}) {
  const editingId = useAtomValue(articleButtonAtom)

  if (!id) return null // id가 할당이 안되면 렌더링하지 않음
  if (!editingId.startsWith(id)) return null //

  const node = boardContent?.[editingId]
  if (!node) return null

  return <div className="absolute inset-0 z-10 rounded bg-white dark:bg-gray-800">{node}</div>
}
