'use client'

import React from 'react'
import { useMemo, useState } from 'react'
import type { SortingState } from '@tanstack/react-table'

// 문자열 키만 허용 (TanStack의 columnId가 string이기 때문)
type ColumnKey<T> = Extract<keyof T, string>

type UseOrderParamsOptions<TRow> = {
  defaultId: ColumnKey<TRow>
  defaultDesc?: boolean
  /**
   * 허용할 컬럼 키 화이트리스트 (선택)
   * 잘못된 id가 들어오면 defaultId로 폴백
   */
  allowedKeys?: readonly ColumnKey<TRow>[]
}

type UseOrderParamsReturn<TRow> = {
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  orderBy: ColumnKey<TRow>
  order: 'asc' | 'desc'
  /** 의존성 배열/쿼리키에 넣기 좋은 안정 참조 객체 */
  sortParam: { orderBy: ColumnKey<TRow>; order: 'asc' | 'desc' }
  /** 코드에서 직접 정렬 변경하고 싶을 때 */
  setOrder: (id: ColumnKey<TRow>, desc?: boolean) => void
}

/**
 * TanStack SortingState → (orderBy, order) 추출 훅
 * - 첫 번째 정렬만 사용
 * - allowedKeys 제공 시 유효성 검사 후 폴백
 */
export function useOrderSort<TRow extends object>(
  opts: UseOrderParamsOptions<TRow>,
): UseOrderParamsReturn<TRow> {
  const { defaultId, defaultDesc = false, allowedKeys } = opts
  const [sorting, setSorting] = useState<SortingState>([
    { id: String(defaultId), desc: defaultDesc },
  ])
  const s = sorting[0]
  const safeId = useMemo<ColumnKey<TRow>>(() => {
    const current = (s?.id as ColumnKey<TRow>) ?? defaultId
    if (!allowedKeys) return current
    return (allowedKeys as readonly string[]).includes(current as string) ? current : defaultId
  }, [s?.id, defaultId, allowedKeys])
  const orderBy = safeId
  const order: 'asc' | 'desc' = s?.desc ? 'desc' : 'asc'
  const sortParam = useMemo(() => ({ orderBy, order }), [orderBy, order])
  const setOrder = (id: ColumnKey<TRow>, desc: boolean = false) => {
    const nextId = allowedKeys && !(allowedKeys as readonly string[]).includes(id) ? defaultId : id
    setSorting([{ id: String(nextId), desc }])
  }

  return { sorting, setSorting, orderBy, order, sortParam, setOrder }
}
