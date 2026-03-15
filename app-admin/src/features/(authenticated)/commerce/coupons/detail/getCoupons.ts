'use server'

import { supabase } from '@/utils/supabase/supabase'

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
      
      applyProduct:products (
        id,
        name,
        description,
        price,
        discount_type,
        discount_value,
        stock,
        status,
        created_at,
        product_images (
          storagePath: storage_path
        )
      ),

      applyCategory:categories (
        id,
        name,
        slug,
        parent_id,
        depth,
        path,
        selectable
      )
    `,
    )
    .eq('id', id)
    .maybeSingle()

  const { data, error } = await query

  if (error) throw new Error(error.message)
  if (!data) return null

  const { data: allCategories, error: categoryError } = await sb
    .schema('ec')
    .from('categories')
    .select('id,parent_id')
    .order('path', { ascending: true })

  if (categoryError) throw new Error(categoryError.message)

  const childCountMap = new Map<number, number>()

  for (const category of allCategories ?? []) {
    childCountMap.set(category.id, 0)
  }

  for (const category of allCategories ?? []) {
    if (category.parent_id == null) continue

    childCountMap.set(category.parent_id, (childCountMap.get(category.parent_id) ?? 0) + 1)
  }

  const applyCategory = (data.applyCategory ?? []).map((category) => {
    const childCount = childCountMap.get(category.id) ?? 0

    return {
      ...category,
      childCount,
      hasChildren: childCount > 0,
    }
  })

  return {
    ...data,
    applyCategory,
  }
}
