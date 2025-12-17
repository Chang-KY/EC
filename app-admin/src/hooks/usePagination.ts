'use client'

import { useCallback, useState } from 'react'

export function usePagination(initialPage = 1) {
  const [page, setPage] = useState(Math.max(1, initialPage))

  const setPageSafe = useCallback((p: number) => {
    setPage(Math.max(1, Math.floor(p || 1)))
  }, [])

  return { page, setPage: setPageSafe }
}
