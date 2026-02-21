'use server'

import { supabase } from '@/utils/supabase/supabase'
import { PRODUCT_IMAGES_TABLE, PRODUCTS_TABLE } from '@/types/db'

export async function getProductDetail(id: number) {
  const sb = await supabase()

  const { data, error } = await sb.schema('ec').rpc('get_product_detail', { p_id: id })

  if (error) throw new Error(error.message)
  if (!data) return null

  return data as {
    product: PRODUCTS_TABLE['Row']
    images: Array<PRODUCT_IMAGES_TABLE['Row']>
    like_count: number
  }
}
