import { z } from 'zod'

export const productStatusSchema = z
  .enum(['hidden', 'active', 'sold_out'] as const) // 예시
  .default('hidden')
export type ProductStatus = z.infer<typeof productStatusSchema>

export const discountTypeSchema = z
  .enum(['none', 'rate', 'fixed'] as const) // 예시
  .default('none')
export type DiscountType = z.infer<typeof discountTypeSchema>
