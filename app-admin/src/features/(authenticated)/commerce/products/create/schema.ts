import { z } from 'zod'
import { productObjectSchema } from '@/features/(authenticated)/commerce/products/productsSchema'
import { productImagesCreateSchema } from '@/features/(authenticated)/commerce/products/productImageSchema'

export type ProductCreateFormValues = z.infer<typeof productFormSchema>
export const productsCreateSchema = productObjectSchema
  .superRefine((v, ctx) => {
    if (v.discount_type === 'fixed' && (v.sale_price == null || Number.isNaN(v.sale_price))) {
      ctx.addIssue({ code: 'custom', path: ['sale_price'], message: 'sale_price가 필요합니다.' })
    }
    if (v.discount_type === 'rate' && (v.sale_rate == null || Number.isNaN(v.sale_rate))) {
      ctx.addIssue({ code: 'custom', path: ['sale_rate'], message: 'sale_rate가 필요합니다.' })
    }
    if (v.discount_type === 'fixed' && v.sale_price != null && v.sale_price > v.price) {
      ctx.addIssue({
        code: 'custom',
        path: ['sale_price'],
        message: 'sale_price는 price보다 클 수 없습니다.',
      })
    }
  })
  .transform((v) => {
    const base = { ...v }

    if (v.discount_type === 'none') {
      base.sale_price = undefined
      base.sale_rate = undefined
    }
    if (v.discount_type === 'fixed') {
      base.sale_rate = undefined
    }
    if (v.discount_type === 'rate') {
      base.sale_price = undefined
    }
    return base
  })

export const productFormSchema = z.object({
  products: productsCreateSchema,
  images: productImagesCreateSchema,
})
