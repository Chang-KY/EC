'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { usePagination } from '@/hooks/usePagination'

export function usePageSetParam(defaultPageSize = 20) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL에서 초기값 읽기
  const initialPage = Number(searchParams.get('page') ?? 1)
  const initialSize = Number(defaultPageSize)

  const { page, setPage, pageSize, setPageSize, sizes } = usePagination(initialPage, initialSize)

  // URL 업데이트 함수
  const updateURL = useCallback(
    (nextPage = page, nextSize = pageSize) => {
      const params = new URLSearchParams(searchParams.toString())

      params.set('page', String(nextPage))
      // params.set('size', String(nextSize)) 사용자가 지정을 할 수 없게 하는게 좋을 듯

      router.replace(`?${params.toString()}`)
    },
    [router, searchParams, page, pageSize],
  )

  // 페이지 변경
  const changePage = useCallback(
    (p: number) => {
      setPage(p)
      updateURL(p, pageSize)
    },
    [setPage, updateURL, pageSize],
  )

  // 페이지 사이즈 변경
  const changePageSize = useCallback(
    (size: number) => {
      setPageSize(size)
      updateURL(1, size) // 페이지 사이즈 변경 시 page=1로
    },
    [setPageSize, updateURL],
  )

  return {
    page,
    pageSize,
    sizes,
    // URL과 동기화된 Setter
    setPage: changePage,
    setPageSize: changePageSize,
  }
}
