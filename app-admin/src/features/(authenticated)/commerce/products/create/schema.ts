import { z } from 'zod'
import { productObjectSchema } from '@/features/(authenticated)/commerce/products/productsSchema'
import { productImagesCreateSchema } from '@/features/(authenticated)/commerce/products/productImageSchema'

export type ProductCreateFormValues = z.infer<typeof productFormSchema>
export const productsCreateSchema = productObjectSchema
  .superRefine((v, ctx) => {
    if (
      (v.discount_type === 'fixed' || v.discount_type === 'rate') &&
      (v.discount_value == null || Number.isNaN(v.discount_value))
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['discount_value'],
        message: 'discount_value가 필요합니다.',
      })
      return // 여기서 끝내면 아래 비교에서 null/NaN로 터지는 거 방지
    }

    // rate: 0 < discount_value < 100
    if (v.discount_type === 'rate') {
      const rate = Number(v.discount_value)
      if (!(rate > 0 && rate < 100)) {
        ctx.addIssue({
          code: 'custom',
          path: ['discount_value'],
          message: '할인율은 0보다 크고 100보다 작아야 합니다.',
        })
      }
    }
  })
  .transform((v) => {
    const base = { ...v }

    if (v.discount_type === 'none') {
      base.discount_value = undefined
    }
    return base
  })

export const productFormSchema = z.object({
  products: productsCreateSchema,
  images: productImagesCreateSchema,
})
