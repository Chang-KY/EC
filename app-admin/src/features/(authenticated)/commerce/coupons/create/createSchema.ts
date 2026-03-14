import { z } from 'zod'
import { CouponSchema } from '@/features/(authenticated)/commerce/coupons/couponsSchema'
import {
  CouponTargetsSchema,
  validateCouponTargets,
} from '@/features/(authenticated)/commerce/coupons/applyModeSchema'

export const CouponsCreateSchema = z
  .object({
    coupons: CouponSchema,
    targets: CouponTargetsSchema,
  })
  .superRefine((data, ctx) => {
    const { coupons, targets } = data
    validateCouponTargets(coupons, targets, ctx)
  })

export type CouponCreateFormValues = z.infer<typeof CouponsCreateSchema>
