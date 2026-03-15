'use server'

import 'server-only'
import {
  CouponsUpdateSchema,
  CouponUpdateFormValues,
} from '@/features/(authenticated)/commerce/coupons/update/updateSchema'
import { supabase } from '@/utils/supabase/supabase'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/constants/routes'

async function updateCoupon(
  applyType: 'product' | 'category',
  couponId?: number,
  patch?: CouponUpdateFormValues,
) {
  if (!couponId) return { ok: false as const, message: 'Invalid coupon ID' }

  if (!patch || Object.keys(patch).length === 0)
    return { ok: false as const, message: 'No fields to update' }

  const sb = await supabase()

  const { product_ids = [], category_ids = [], ...couponPatch } = patch

  if (Object.keys(couponPatch).length > 0) {
    const { error: couponError } = await sb
      .schema('ec')
      .from('coupons')
      .update(couponPatch)
      .eq('id', couponId)

    if (couponError) return { ok: false as const, message: couponError.message }
  }

  const { error: deleteAppliesError } = await sb
    .schema('ec')
    .from(applyType === 'product' ? 'coupon_products' : 'coupon_categories')
    .delete()
    .eq('coupon_id', couponId)

  if (deleteAppliesError) {
    return { ok: false as const, message: deleteAppliesError.message }
  }

  if (product_ids.length > 0 && applyType === 'product') {
    if (couponPatch.product_mode !== 'all') {
      const rows = product_ids.map((productId) => ({
        coupon_id: couponId,
        product_id: productId,
      }))

      const { error: insertProductError } = await sb
        .schema('ec')
        .from('coupon_products')
        .insert(rows)

      if (insertProductError) {
        return { ok: false as const, message: insertProductError.message }
      }
    }
  }

  if (category_ids.length > 0 && applyType === 'category') {
    if (couponPatch.category_mode !== 'all') {
      const rows = category_ids.map((categoryId) => ({
        coupon_id: couponId,
        category_id: categoryId,
      }))

      const { error: insertCategoryError } = await sb
        .schema('ec')
        .from('coupon_categories')
        .insert(rows)

      if (insertCategoryError) {
        return { ok: false as const, message: insertCategoryError.message }
      }
    }
  }

  revalidatePath(`${ROUTES.COUPONS}/${couponId}`)

  return { ok: true as const }
}

export async function couponUpdateProductModeAction(data: CouponUpdateFormValues) {
  const { id: couponId, product_mode, product_ids } = CouponsUpdateSchema.parse(data)

  return updateCoupon('product', couponId, { product_mode, product_ids })
}

export async function couponUpdateCategoryModeAction(data: CouponUpdateFormValues) {
  const { id: couponId, category_mode, category_ids } = CouponsUpdateSchema.parse(data)
  return updateCoupon('category', couponId, { category_mode, category_ids })
}
