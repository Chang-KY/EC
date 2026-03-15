'use client'

import React from 'react'
import Loading from '@/components/loading/Loading'
import { useAtomValue } from 'jotai'
import { metaChipLoadingAtom } from '@/store/metaChipLoadingAtom'

export default function MetaChipLoading() {
  const isSaving = useAtomValue(metaChipLoadingAtom)

  if (!isSaving) return null
  return (
    <div className="absolute inset-x-0 z-10 flex h-[50px] w-[calc(100%+1rem)] items-center justify-center gap-3 rounded-md bg-indigo-100/80">
      <Loading size={20} />
      <span className="text-xs text-black">수정중입니다...</span>
    </div>
  )
}
