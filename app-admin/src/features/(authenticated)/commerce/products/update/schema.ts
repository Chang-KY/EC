import { productObjectSchema } from '@/features/(authenticated)/commerce/products/productsSchema'
import { z } from 'zod'

export const productsUpdateSchema = productObjectSchema
  .partial()
  .superRefine((v, ctx) => {
    const dt = v.discount_type

    // discount_type이 "들어온 경우"는 강하게 일관성 검증
    if (dt === 'none') {
      if (v.sale_price != null) {
        ctx.addIssue({
          code: 'custom',
          path: ['sale_price'],
          message: '할인 없음(none)일 때 sale_price는 보낼 수 없습니다.',
        })
      }
      if (v.sale_rate != null) {
        ctx.addIssue({
          code: 'custom',
          path: ['sale_rate'],
          message: '할인 없음(none)일 때 sale_rate는 보낼 수 없습니다.',
        })
      }
    }

    if (dt === 'fixed') {
      if (v.sale_price == null || Number.isNaN(v.sale_price)) {
        ctx.addIssue({
          code: 'custom',
          path: ['sale_price'],
          message: 'discount_type이 fixed면 sale_price가 필요합니다.',
        })
      }
      if (v.sale_rate != null) {
        ctx.addIssue({
          code: 'custom',
          path: ['sale_rate'],
          message: 'discount_type이 fixed면 sale_rate는 보낼 수 없습니다.',
        })
      }
      if (v.price != null && v.sale_price != null && v.sale_price > v.price) {
        ctx.addIssue({
          code: 'custom',
          path: ['sale_price'],
          message: 'sale_price는 price보다 클 수 없습니다.',
        })
      }
    }

    if (dt === 'rate') {
      if (v.sale_rate == null || Number.isNaN(v.sale_rate)) {
        ctx.addIssue({
          code: 'custom',
          path: ['sale_rate'],
          message: 'discount_type이 rate면 sale_rate가 필요합니다.',
        })
      }
      if (v.sale_price != null) {
        ctx.addIssue({
          code: 'custom',
          path: ['sale_price'],
          message: 'discount_type이 rate면 sale_price는 보낼 수 없습니다.',
        })
      }
    }

    if (dt == null) {
      if (v.sale_price != null && v.sale_rate != null) {
        ctx.addIssue({
          code: 'custom',
          path: ['sale_price'],
          message:
            'sale_price와 sale_rate를 동시에 보낼 수 없습니다. (discount_type도 함께 보내 주세요)',
        })
      }
      if (v.price != null && v.sale_price != null && v.sale_price > v.price) {
        ctx.addIssue({
          code: 'custom',
          path: ['sale_price'],
          message: 'sale_price는 price보다 클 수 없습니다.',
        })
      }
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

export type ProductUpdateUpdateFormValue = z.infer<typeof productsUpdateSchema>
