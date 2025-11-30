'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useListFilter } from '@/hooks/useListFilter'

export function useListFilterParam<T extends string>(
  paramKey: string, // URL에서 쓸 쿼리 키 이름 (예: 'status')
  initial: T, // 기본값 (예: 'all')
  onChange?: (v: T) => void, // 추가로 하고 싶은 동작 (예: setPage(1))
) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 1) URL → 초기값
  const fromUrl = searchParams.get(paramKey) as T | null
  const initialValue = fromUrl ?? initial

  // 2) 기존 useListFilter 재사용
  const { value, set } = useListFilter<T>(initialValue, (v) => {
    // (1) 먼저 원래 onChange 호출 (예: setPage(1))
    onChange?.(v)

    // (2) URL 쿼리 업데이트
    const params = new URLSearchParams(searchParams.toString())

    if (v === initial) {
      // 기본값이면 쿼리에서 제거해서 깔끔하게
      params.delete(paramKey)
    } else {
      params.set(paramKey, v)
    }

    router.replace(`?${params.toString()}`)
  })

  return { value, set }
}
