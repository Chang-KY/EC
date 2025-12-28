'use client'

import { useCallback, useMemo, useState } from 'react'
import { pageSizeList } from '@/constants/page/pageSizeList'

function nearestAllowedSize(value: number, allowed: readonly number[]) {
  if (!Number.isFinite(value)) return allowed[0]
  return allowed.reduce((best, cur) => {
    const bestDiff = Math.abs(best - value)
    const curDiff = Math.abs(cur - value)
    if (curDiff < bestDiff) return cur
    if (curDiff === bestDiff) return Math.min(best, cur)
    return best
  }, allowed[0])
}

export function usePageSize(initialSize?: number) {
  const sizeList = useMemo(() => pageSizeList, [])
  const [size, _setSize] = useState(() => {
    return nearestAllowedSize(initialSize ?? sizeList[0], sizeList)
  })
  const setSize = useCallback(
    (next: number) => {
      const normalized = nearestAllowedSize(next, sizeList)
      _setSize(normalized)
    },
    [sizeList],
  )
  return {
    size, // 현재 선택된 페이지 사이즈 (7|14|35|70) 에 중 하나
    setSize, // number 넣으면 자동 보정
    sizeList, // [7,14,35,70]
  }
}
