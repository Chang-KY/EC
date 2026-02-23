'use server'

import { supabase } from '@/utils/supabase/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { FormState } from '@/types/FormState'
import { z } from 'zod'
import {
  CouponCreateFormValues,
  CouponsCreateSchema,
} from '@/features/(authenticated)/commerce/coupons/create/createSchema'

export async function couponCreateAction(
  prev: FormState<CouponCreateFormValues>,
  formData: FormData,
): Promise<FormState<CouponCreateFormValues>> {
  const couponKind = (formData.get('coupons.coupon_kind') ?? 'general') as 'general' | 'code'

  const rawCouponCode = formData.get('coupons.coupon_code')
  const couponCode =
    couponKind === 'general'
      ? null
      : rawCouponCode && String(rawCouponCode).trim()
        ? String(rawCouponCode).trim()
        : null

  const couponsDraft = {
    name: formData.get('coupons.name') ?? '',

    discount_type: formData.get('coupons.discount_type') ?? 'rate',
    discount_value: formData.get('coupons.discount_value') ?? 20,

    coupon_kind: couponKind,
    coupon_code: couponCode,

    product_mode: formData.get('coupons.product_mode') ?? 'all',
    category_mode: formData.get('coupons.category_mode') ?? 'all',

    description: formData.get('coupons.description') ?? '',
    max_discount: formData.get('coupons.max_discount') ?? null,
    min_order_amount: formData.get('coupons.min_order_amount') ?? null,

    is_active: formData.get('coupons.is_active') ?? true,
    starts_at: formData.get('coupons.starts_at') ?? null,
    ends_at: formData.get('coupons.ends_at') ?? null,

    stackable: formData.get('coupons.stackable') ?? false,
    max_issue: formData.get('coupons.max_issue') ?? null,
    max_redemptions: formData.get('coupons.max_redemptions') ?? null,
    max_per_user: formData.get('coupons.max_per_user') ?? 1,

    created_by: formData.get('coupons.created_by') ?? null,
    notes: formData.get('coupons.notes') ?? '',
  }

  const couponsParsed = CouponsCreateSchema.safeParse(couponsDraft)
  if (!couponsParsed.success) {
    const { fieldErrors, formErrors } = z.flattenError(couponsParsed.error)
    const prefixed = Object.fromEntries(
      Object.entries(fieldErrors).map(([k, v]) => [`coupons.${k}`, v]),
    )

    return {
      ...prev,
      values: {
        ...prev.values,
        coupons: couponsDraft,
      } as Partial<CouponCreateFormValues>,
      fieldErrors: { ...prefixed, _form: formErrors },
      success: false,
    }
  }

  revalidatePath('/commerce/coupons')
  redirect('/commerce/coupons')
}
