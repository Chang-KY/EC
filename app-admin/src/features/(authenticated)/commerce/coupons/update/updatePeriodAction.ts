'use server'

import 'server-only'
import type { FormState } from '@/types/FormState'
import { supabase } from '@/utils/supabase/supabase'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/constants/routes'
import {
  CouponUpdateFormValues,
  CouponsUpdateSchema,
  CouponUpdateDiscountTypeSchema,
} from '@/features/(authenticated)/commerce/coupons/update/updateSchema'
import { toFieldErrors } from '@/utils/toFieldErrors'
import { getNullableString } from '@/utils/formdataType'

export async function updatePeriodAction(
  couponId: number,
  prev: FormState<CouponUpdateFormValues>,
  formData: FormData,
): Promise<FormState<CouponUpdateFormValues>> {
  const couponsDraft = {
    starts_at: getNullableString(formData, 'coupons.starts_at'),
    ends_at: getNullableString(formData, 'coupons.ends_at'),
  }

  const couponsParsed = CouponsUpdateSchema.safeParse(couponsDraft)
  if (!couponsParsed.success) {
    const fieldErrors = toFieldErrors(couponsParsed.error)

    return {
      ...prev,
      values: {
        ...prev.values,
        coupons: couponsDraft,
      } as Partial<CouponUpdateFormValues>,
      fieldErrors,
      success: false,
    }
  }

  const patch = couponsParsed.data

  const sb = await supabase()
  const { error } = await sb.schema('ec').from('coupons').update(couponsDraft).eq('id', couponId)
  if (error) {
    return {
      ...prev,
      values: {
        ...prev.values,
        coupons: couponsDraft,
      } as Partial<CouponUpdateFormValues>,
      fieldErrors: { _form: [error.message] },
      success: false,
    }
  }

  revalidatePath(`${ROUTES.PRODUCTS}/${couponId}`)

  return {
    ...prev,
    values: { ...prev.values, coupons: patch } as Partial<CouponUpdateFormValues>,
    fieldErrors: {},
    success: true,
  }
}
