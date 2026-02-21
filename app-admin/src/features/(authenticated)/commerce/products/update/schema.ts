import { productObjectSchema } from '@/features/(authenticated)/commerce/products/productsSchema'
import { z } from 'zod'

export const productsUpdateSchema = productObjectSchema
  .partial()
  .superRefine((v, ctx) => {
    const dt = v.discount_type
    const dv = v.discount_value

    const hasDiscountValue = dv != null && !Number.isNaN(Number(dv))

    // discount_type을 보냈으면 타입에 맞게 강하게 검증
    if (dt === 'none') {
      if (hasDiscountValue) {
        ctx.addIssue({
          code: 'custom',
          path: ['discount_value'],
          message: '할인 없음(none)일 때 discount_value는 보낼 수 없습니다.',
        })
      }
    }

    if (dt === 'fixed') {
      if (!hasDiscountValue) {
        ctx.addIssue({
          code: 'custom',
          path: ['discount_value'],
          message: 'discount_type이 fixed면 discount_value가 필요합니다.',
        })
      } else {
        const fixed = Number(dv)
        if (!(fixed > 0)) {
          ctx.addIssue({
            code: 'custom',
            path: ['discount_value'],
            message: '고정 할인 금액은 0보다 커야 합니다.',
          })
        }
        // (선택) price가 같이 오면 "할인금액 < price" 같은 룰도 걸고 싶을 때
        if (v.price != null && fixed >= Number(v.price)) {
          ctx.addIssue({
            code: 'custom',
            path: ['discount_value'],
            message: '고정 할인 금액은 price보다 작아야 합니다.',
          })
        }
      }
    }

    if (dt === 'rate') {
      if (!hasDiscountValue) {
        ctx.addIssue({
          code: 'custom',
          path: ['discount_value'],
          message: 'discount_type이 rate면 discount_value가 필요합니다.',
        })
      } else {
        const rate = Number(dv)
        if (!(rate > 0 && rate < 100)) {
          ctx.addIssue({
            code: 'custom',
            path: ['discount_value'],
            message: '할인율은 0보다 크고 100보다 작아야 합니다.',
          })
        }
        // (선택) 정수 퍼센트만 허용할 거면
        if (!Number.isInteger(rate)) {
          ctx.addIssue({
            code: 'custom',
            path: ['discount_value'],
            message: '할인율은 정수(%)만 허용합니다.',
          })
        }
      }
    }

    // discount_type이 안 왔는데 discount_value만 오면 일관성 검증 불가 → 막기
    if (dt == null) {
      if (hasDiscountValue) {
        ctx.addIssue({
          code: 'custom',
          path: ['discount_value'],
          message: 'discount_value만 보낼 수 없습니다. discount_type도 함께 보내 주세요.',
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

export type ProductUpdateFormValue = z.infer<typeof productsUpdateSchema>
