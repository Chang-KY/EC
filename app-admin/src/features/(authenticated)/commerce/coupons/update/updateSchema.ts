import { z } from 'zod'
import {
  CouponSchema,
  validateDiscountRule,
} from '@/features/(authenticated)/commerce/coupons/couponsSchema'
import { discountTypeSchema } from '@/schema/DiscountTypeMeta'

export const CouponsUpdateSchema = CouponSchema.partial()

export type CouponUpdateFormValues = z.infer<typeof CouponsUpdateSchema>

export const CouponUpdateDiscountTypeSchema = z
  .object({
    discount_type: discountTypeSchema.default('rate'),
    discount_value: z.number().int(),
  })
  .superRefine(validateDiscountRule)

export type CouponUpdateDiscountTypeFormValues = z.infer<typeof CouponUpdateDiscountTypeSchema>
