'use server'

import 'server-only'
import { supabase } from '@/utils/supabase/supabase'
import { ListParams, listParamsSchema } from '@/types/ListParams'
import { DiscountType } from '@/types/enum'

export async function getProductsService(params: ListParams) {
  const { page, size, keyword, order, orderBy } = listParamsSchema.parse(params)
  const sb = await supabase()

  const from = (page - 1) * size
  const to = from + size - 1

  // 공통 베이스 쿼리 (keyword는 동일 적용)
  let base = sb.schema('ec').from('products').select('*', { count: 'exact' })

  if (keyword.trim()) {
    const k = keyword.trim()
    base = base.or(`name.ilike.%${k}%`)
  }

  // DB 정렬 가능한 경우
  if (orderBy !== 'final_price') {
    const { data, error, count } = await base
      .range(from, to)
      .order(orderBy, { ascending: order === 'asc' })

    if (error) throw new Error(error.message)

    return {
      items: data ?? [],
      total: count ?? 0,
      page,
      size,
    }
  }

  // final_price 정렬: DB로 못 보냄 → 전체 가져와서 계산 정렬 후 페이징
  const { data, error, count } = await base.order('id', { ascending: false })

  if (error) throw new Error(error.message)

  const itemsAll = (data ?? []).slice()

  itemsAll.sort((a, b) => {
    const av = calcFinalPrice(a)
    const bv = calcFinalPrice(b)
    return order === 'asc' ? av - bv : bv - av
  })

  const paged = itemsAll.slice(from, to + 1)

  return {
    items: paged,
    total: count ?? itemsAll.length,
    page,
    size,
  }
}

function calcFinalPrice(row: {
  price: number | null
  discount_type: DiscountType | null
  discount_value: number | null
}) {
  const price = row.price ?? 0
  const dt = row.discount_type ?? 'none'
  const dv = row.discount_value ?? null
  if (price <= 0) return 0

  if (dt === 'none' || dv == null) return price

  if (dt === 'fixed') {
    const amount = Math.max(0, Math.min(price, dv))
    return price - amount
  }

  // rate
  const pct = Math.max(0, Math.min(100, dv))
  const discountWon = Math.round((price * pct) / 100)
  return Math.max(0, price - discountWon)
}
