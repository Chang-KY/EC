'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useDebouncedState } from '@/hooks/useDebouncedKeyword'

export function useKeywordSetParam(delay = 700) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialKeyword = searchParams.get('keyword') ?? ''

  const { value, setValue, debounced, isDebouncing, cancel, flush } = useDebouncedState(
    initialKeyword,
    delay,
    { trailing: true },
  )

  // debounced가 변경될 때만 URL 업데이트
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    console.log(debounced)
    if (debounced) params.set('keyword', encodeURIComponent(debounced))
    else params.delete('keyword')

    router.replace(`?${params.toString()}`)
  }, [debounced])

  return {
    keyword: value,
    setKeyword: setValue,
    debouncedSearchTerm: debounced,
    isDebouncing,
    cancel,
    flush,
  }
}
