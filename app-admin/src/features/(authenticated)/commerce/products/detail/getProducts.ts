'use server'

import { supabase } from '@/utils/supabase/supabase'

export async function getProductDetail(id: number) {
  const sb = await supabase()

  const { data, error } = await sb.schema('ec').rpc('get_product_detail', { p_id: id })

  if (error) throw new Error(error.message)
  if (!data) return null

  return data as {
    product: {
      id: number
      name: string
      description: string | null
      price: number
      sale_price: number | null
      sale_rate: number | null
      stock: number | null
      created_at: string | null
      status: string | null
      discount_type: string
    }
    images: Array<{
      id: number
      product_id: number
      role: string
      storage_path: string
      sort_order: number
      alt: string | null
      width: number | null
      height: number | null
      mime_type: string | null
      created_at: string
    }>
    like_count: number
  }
}
