'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { FormState } from '@/types/FormState'
import {
  CouponCreateFormValues,
  CouponsCreateSchema,
} from '@/features/(authenticated)/commerce/coupons/create/createSchema'
import { supabase } from '@/utils/supabase/supabase'
import { ApplyMode, CouponKind, DiscountType } from '@/types/enum'
import { getAdminUser } from '@/lib/getAdminUser'
import {
  getBoolean,
  getNullableNumber,
  getNullableString,
  getNumber,
  getString,
} from '@/utils/formdataType'
import { toFieldErrors } from '@/utils/toFieldErrors'

export async function couponCreateAction(
  prev: FormState<CouponCreateFormValues>,
  formData: FormData,
): Promise<FormState<CouponCreateFormValues>> {
  const couponKind = (formData.get('coupons.coupon_kind') ?? 'general') as CouponKind

  const rawCouponCode = formData.get('coupons.coupon_code')
  const couponCode =
    couponKind === 'general'
      ? null
      : rawCouponCode && String(rawCouponCode).trim()
        ? String(rawCouponCode).trim()
        : null
  const { user: adminUser } = await getAdminUser()

  const targetsDraft = {
    categories: formData
      .getAll('targets.category_ids')
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value)),
    products: formData
      .getAll('targets.product_ids')
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value)),
  }
  const rawProductMode = getString(formData, 'coupons.product_mode', 'all') as ApplyMode
  const rawCategoryMode = getString(formData, 'coupons.category_mode', 'all') as ApplyMode

  const resolvedProductMode: ApplyMode =
    (rawProductMode === 'include' || rawProductMode === 'exclude') &&
    targetsDraft.products.length === 0
      ? 'all'
      : rawProductMode

  const resolvedCategoryMode: ApplyMode =
    (rawCategoryMode === 'include' || rawCategoryMode === 'exclude') &&
    targetsDraft.categories.length === 0
      ? 'all'
      : rawCategoryMode

  const couponsDraft = {
    name: getString(formData, 'coupons.name'),
    discount_type: getString(formData, 'coupons.discount_type', 'rate') as DiscountType,
    discount_value: getNumber(formData, 'coupons.discount_value', 20),
    coupon_kind: couponKind,
    coupon_code: couponCode,

    product_mode: resolvedProductMode,
    category_mode: resolvedCategoryMode,

    description: getNullableString(formData, 'coupons.description'),
    max_discount: getNullableNumber(formData, 'coupons.max_discount'),
    min_order_amount: getNullableNumber(formData, 'coupons.min_order_amount'),
    is_active: getBoolean(formData, 'coupons.is_active'),
    starts_at: getNullableString(formData, 'coupons.starts_at'),
    ends_at: getNullableString(formData, 'coupons.ends_at'),
    stackable: getBoolean(formData, 'coupons.stackable'),
    max_issue: getNullableNumber(formData, 'coupons.max_issue'),
    max_redemptions: getNullableNumber(formData, 'coupons.max_redemptions'),
    max_per_user: getNumber(formData, 'coupons.max_per_user', 1),
    created_by: adminUser?.id ?? null,
    notes: getNullableString(formData, 'coupons.notes'),
  }

  const couponsParsed = CouponsCreateSchema.safeParse({
    coupons: couponsDraft,
    targets: targetsDraft,
  })
  if (!couponsParsed.success) {
    const fieldErrors = toFieldErrors(couponsParsed.error)

    return {
      ...prev,
      values: {
        ...prev.values,
        coupons: couponsDraft,
      } as Partial<CouponCreateFormValues>,
      fieldErrors,
      success: false,
    }
  }
  const sb = await supabase()
  const { data: couponRow, error: couponErr } = await sb
    .schema('ec')
    .from('coupons')
    .insert(couponsParsed.data.coupons)
    .select('id')
    .single()

  if (couponErr || !couponRow) {
    return {
      ...prev,
      values: {
        ...prev.values,
        coupons: couponsDraft,
      } as Partial<CouponCreateFormValues>,
      success: false,
      fieldErrors: {
        _form: ['쿠폰 생성에 실패했어요.'],
      },
    }
  }

  // 중복 제거
  const categoryIds = [...new Set(couponsParsed.data.targets.categories)]
  const productIds = [...new Set(couponsParsed.data.targets.products)]

  const couponCategoryRows = categoryIds.map((categoryId) => ({
    coupon_id: couponRow.id,
    category_id: categoryId,
  }))

  const couponProductRows = productIds.map((productId) => ({
    coupon_id: couponRow.id,
    product_id: productId,
  }))

  if (couponCategoryRows.length > 0) {
    const { error: categoryErr } = await sb
      .schema('ec')
      .from('coupon_categories')
      .insert(couponCategoryRows)

    if (categoryErr) {
      return {
        ...prev,
        values: {
          ...prev.values,
          coupons: couponsDraft,
        } as Partial<CouponCreateFormValues>,
        success: false,
        fieldErrors: {
          _form: ['쿠폰 카테고리 연결 저장에 실패했어요.'],
        },
      }
    }
  }

  if (couponProductRows.length > 0) {
    const { error: productErr } = await sb
      .schema('ec')
      .from('coupon_products')
      .insert(couponProductRows)

    if (productErr) {
      return {
        ...prev,
        values: {
          ...prev.values,
          coupons: couponsDraft,
        } as Partial<CouponCreateFormValues>,
        success: false,
        fieldErrors: {
          _form: ['쿠폰 상품 연결 저장에 실패했어요.'],
        },
      }
    }
  }

  revalidatePath('/commerce/coupons')
  redirect('/commerce/coupons')
}
