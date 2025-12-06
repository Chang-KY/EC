'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { useOrderSort } from '@/hooks/useOrderSort'

type ColumnKey<T> = Extract<keyof T, string>

type UseOrderParamsOptions<TRow> = {
  defaultId: ColumnKey<TRow>
  defaultDesc?: boolean
  allowedKeys?: readonly ColumnKey<TRow>[]
}

export function useOrderSortParam<TRow extends object>(
  opts: UseOrderParamsOptions<TRow> & {
    /** URL에서 사용할 쿼리 키 이름 (기본: orderBy) */
    orderByKey?: string
    /** URL에서 사용할 정렬 방향 키 이름 (기본: order) */
    orderKey?: string
  },
) {
  const {
    defaultId,
    defaultDesc = false,
    allowedKeys,
    orderByKey = 'orderBy',
    orderKey = 'order',
  } = opts

  const router = useRouter()
  const searchParams = useSearchParams()

  /* -------------------------------
   * 1) URL → 초기 정렬값 파싱
   * ----------------------------- */
  const initialFromUrl = useMemo(() => {
    const urlOrderBy = searchParams.get(orderByKey)
    const urlOrder = searchParams.get(orderKey)

    let initialId = defaultId
    if (urlOrderBy) {
      const candidate = urlOrderBy as ColumnKey<TRow>
      if (!allowedKeys || (allowedKeys as readonly string[]).includes(candidate)) {
        initialId = candidate
      }
    }

    let initialDesc = defaultDesc
    if (urlOrder === 'asc') initialDesc = false
    if (urlOrder === 'desc') initialDesc = true

    return { initialId, initialDesc }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, orderByKey, orderKey, defaultId, defaultDesc, allowedKeys])

  /* -------------------------------
   * 2) 기존 정렬 훅 사용
   *    (URL에서 파싱한 값을 default로 주입)
   * ----------------------------- */
  const core = useOrderSort<TRow>({
    defaultId: initialFromUrl.initialId,
    defaultDesc: initialFromUrl.initialDesc,
    allowedKeys,
  })

  const { orderBy, order } = core

  /* -------------------------------
   * 3) 정렬 변경 시 URL 동기화
   * ----------------------------- */
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    const currentOrderBy = params.get(orderByKey)
    const currentOrder = params.get(orderKey)

    // 🔒 이미 URL이 우리가 가진 정렬 상태와 같으면 아무 것도 안 함
    if (currentOrderBy === orderBy && currentOrder === order) {
      return
    }

    params.set(orderByKey, orderBy)
    params.set(orderKey, order)

    router.replace(`?${params.toString()}`, { scroll: false })
  }, [orderBy, order, router, searchParams, orderByKey, orderKey])

  return core // sorting, setSorting, orderBy, order, sortParam, setOrder 그대로 노출
}
