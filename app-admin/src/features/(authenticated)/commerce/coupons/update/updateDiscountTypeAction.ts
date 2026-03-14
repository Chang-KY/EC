'use server'

import 'server-only'
import type { FormState } from '@/types/FormState'
import { supabase } from '@/utils/supabase/supabase'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/constants/routes'
import {
  CouponUpdateDiscountTypeFormValues,
  CouponUpdateDiscountTypeSchema,
} from '@/features/(authenticated)/commerce/coupons/update/updateSchema'
import { toFieldErrors } from '@/utils/toFieldErrors'
import { getNumber, getString } from '@/utils/formdataType'
import { DiscountType } from '@/types/enum'

export async function updateDiscountTypeAction(
  couponId: number,
  prev: FormState<CouponUpdateDiscountTypeFormValues>,
  formData: FormData,
): Promise<FormState<CouponUpdateDiscountTypeFormValues>> {
  const couponsDraft = {
    discount_type: getString(formData, 'discount_type', 'rate') as DiscountType,
    discount_value: getNumber(formData, 'discount_value', 1),
  }

  const couponsParsed = CouponUpdateDiscountTypeSchema.safeParse(couponsDraft)
  if (!couponsParsed.success) {
    const fieldErrors = toFieldErrors(couponsParsed.error)

    return {
      ...prev,
      values: {
        ...prev.values,
        discount_type: couponsDraft.discount_type,
        discount_value: couponsDraft.discount_value,
      } as Partial<CouponUpdateDiscountTypeFormValues>,
      fieldErrors,
      success: false,
    }
  }

  const patch = couponsParsed.data

  const sb = await supabase()
  const { error } = await sb.schema('ec').from('coupons').update(patch).eq('id', couponId)
  if (error) {
    return {
      ...prev,
      values: {
        ...prev.values,
        coupons: couponsDraft,
      } as Partial<CouponUpdateDiscountTypeFormValues>,
      fieldErrors: { _form: [error.message] },
      success: false,
    }
  }

  revalidatePath(`${ROUTES.PRODUCTS}/${couponId}`)

  return {
    ...prev,
    values: { ...prev.values, coupons: patch } as Partial<CouponUpdateDiscountTypeFormValues>,
    fieldErrors: {},
    success: true,
  }
}
