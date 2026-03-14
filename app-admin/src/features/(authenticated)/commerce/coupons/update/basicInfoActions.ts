'use server'

import { ROUTES } from '@/constants/routes'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/utils/supabase/supabase'
import {
  CouponsUpdateSchema,
  CouponUpdateFormValues,
} from '@/features/(authenticated)/commerce/coupons/update/updateSchema'

async function updateCoupon(couponId?: number, patch?: CouponUpdateFormValues) {
  if (!couponId) return { ok: false as const, message: 'Invalid coupon ID' }
  if (!patch || Object.keys(patch).length === 0)
    return { ok: false as const, message: 'No fields to update' }

  const sb = await supabase()
  const { error } = await sb.schema('ec').from('coupons').update(patch).eq('id', couponId)
  if (error) return { ok: false as const, message: error.message }

  revalidatePath(`${ROUTES.COUPONS}/${couponId}`)
  return { ok: true as const }
}

export async function couponUpdateNameAction(data: CouponUpdateFormValues) {
  const { id: couponId, name } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { name })
}

export async function couponUpdateDescriptionAction(data: CouponUpdateFormValues) {
  const { id: couponId, description } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { description })
}

export async function couponUpdateDiscountTypeAction(data: CouponUpdateFormValues) {
  const { id: couponId, discount_type } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { discount_type })
}

export async function couponUpdateDiscountValueAction(data: CouponUpdateFormValues) {
  const { id: couponId, discount_value } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { discount_value })
}

export async function couponUpdateMaxDiscountAction(data: CouponUpdateFormValues) {
  const { id: couponId, max_discount } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { max_discount })
}

export async function couponUpdateMinOrderAmountAction(data: CouponUpdateFormValues) {
  const { id: couponId, min_order_amount } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { min_order_amount })
}

export async function couponUpdateIsActiveAction(data: CouponUpdateFormValues) {
  const { id: couponId, is_active } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { is_active })
}

export async function couponUpdateStartsAtAction(data: CouponUpdateFormValues) {
  const { id: couponId, starts_at } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { starts_at })
}

export async function couponUpdateEndsAtAction(data: CouponUpdateFormValues) {
  const { id: couponId, ends_at } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { ends_at })
}

export async function couponUpdateStackableAction(data: CouponUpdateFormValues) {
  const { id: couponId, stackable } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { stackable })
}

export async function couponUpdateMaxIssueAction(data: CouponUpdateFormValues) {
  const { id: couponId, max_issue } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { max_issue })
}

export async function couponUpdateMaxPerUserAction(data: CouponUpdateFormValues) {
  const { id: couponId, max_per_user } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { max_per_user })
}

export async function couponUpdateMaxRedemptionsAction(data: CouponUpdateFormValues) {
  const { id: couponId, max_redemptions } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { max_redemptions })
}

export async function couponUpdateNotesAction(data: CouponUpdateFormValues) {
  const { id: couponId, notes } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { notes })
}

export async function couponUpdateCouponKindAction(data: CouponUpdateFormValues) {
  const { id: couponId, coupon_kind } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { coupon_kind })
}

export async function couponUpdateCouponCodeAction(data: CouponUpdateFormValues) {
  const { id: couponId, coupon_code } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { coupon_code })
}

export async function couponUpdateProductModeAction(data: CouponUpdateFormValues) {
  const { id: couponId, product_mode } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { product_mode })
}

export async function couponUpdateCategoryModeAction(data: CouponUpdateFormValues) {
  const { id: couponId, category_mode } = CouponsUpdateSchema.parse(data)
  return updateCoupon(couponId, { category_mode })
}
