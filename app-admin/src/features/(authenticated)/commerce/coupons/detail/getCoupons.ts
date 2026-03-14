'use server'

import { supabase } from '@/utils/supabase/supabase'
import { PRODUCT_IMAGES_TABLE, PRODUCTS_TABLE } from '@/types/db'

import { QueryData } from '@supabase/supabase-js'

export async function getCouponDetail(id: number) {
  const sb = await supabase()

  const query = sb
    .schema('ec')
    .from('coupons')
    .select(
      `
      id,
      name,
      description,
      discount_type,
      discount_value,
      max_discount,
      min_order_amount,
      is_active,
      starts_at,
      ends_at,
      stackable,
      max_issue,
      max_redemptions,
      max_per_user,
      notes,
      created_at,
      coupon_kind,
      coupon_code,
      product_mode,
      category_mode,
      
      creator:admins!coupons_created_by_fkey (
        id,
        email,
        name,
        avatar_url,
        phone,
        status,
        last_login,
        created_at,
        role,
        level
      ),

      coupon_products (
        product_id,
        created_at,
        product:products (
          id,
          name,
          description,
          price,
          discount_type,
          discount_value,
          stock,
          status,
          created_at
        )
      ),

      coupon_categories (
        category_id,
        created_at,
        category:categories (
          id,
          name,
          slug,
          parent_id,
          depth,
          selectable
        )
      )
    `,
    )
    .eq('id', id)
    .maybeSingle()

  const { data, error } = await query

  if (error) throw new Error(error.message)
  if (!data) return null

  return data
}
