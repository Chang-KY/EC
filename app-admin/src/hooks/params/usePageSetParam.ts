'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { usePagination } from '@/hooks/usePagination'

export function usePageSetParam(defaultPageSize = 7) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL에서 초기값 읽기
  const initialPage = Number(searchParams.get('page') ?? 1)
  const initialSize = Number(searchParams.get('size') ?? defaultPageSize)

  const { page, setPage, pageSize, setPageSize } = usePagination(initialPage, initialSize)

  // URL 업데이트 함수
  const updateURL = useCallback(
    (nextPage = page, nextSize = pageSize) => {
      const params = new URLSearchParams(searchParams.toString())

      params.set('page', String(nextPage))
      params.set('size', String(nextSize))

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
    setPage: changePage,
    setPageSize: changePageSize,
  }
}
