'use client'

import { useSetAtom } from 'jotai'
import { articleButtonAtom } from '@/store/articleEditAtoms'

export default function ArticleButton({ targetId, label }: { targetId: string; label: string }) {
  const setId = useSetAtom(articleButtonAtom)

  return (
    <button
      type="button"
      onClick={() => setId(targetId)}
      className="h-full w-full text-left text-gray-700"
    >
      {label}
    </button>
  )
}
