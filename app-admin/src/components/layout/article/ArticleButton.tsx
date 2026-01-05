'use client'

import { useSetAtom } from 'jotai'
import { articleButtonAtom } from '@/store/articleEditAtoms'
import DropdownButton from '@/components/ui/DropdownButton'

export default function ArticleButton({ targetId, label }: { targetId: string; label: string }) {
  const setId = useSetAtom(articleButtonAtom)

  return (
    <DropdownButton
      label={label}
      onClick={() => {
        console.log('ArticleButton clicked, targetId:', targetId)
        setId(targetId)
      }}
    />
  )
}
