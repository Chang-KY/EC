import { z } from 'zod'
import { KeyRound, Ticket } from 'lucide-react'
import { Meta } from '@/types/Meta'
import { applyModeSchema } from '@/features/(authenticated)/commerce/coupons/applyModeSchema'
import { discountTypeSchema } from '@/schema/DiscountTypeMeta'
import { DiscountType } from '@/types/enum'

export const couponKindSchema = z
  .enum(['general', 'code'] as const) // 예시
  .default('general')

export type CouponKind = z.infer<typeof couponKindSchema>

export const COUPON_KIND_META = {
  general: {
    label: '일반 쿠폰',
    icon: Ticket,
    className: 'text-sky-600 dark:text-sky-300',
  },
  code: {
    label: '코드 쿠폰',
    icon: KeyRound,
    className: 'text-violet-600 dark:text-violet-300',
  },
} as const satisfies Record<CouponKind, Required<Pick<Meta, 'label' | 'icon' | 'className'>>>

export function validateDiscountRule(
  val: { discount_type?: DiscountType; discount_value?: number },
  ctx: z.RefinementCtx,
) {
  if (val.discount_type === 'rate') {
    if (
      typeof val.discount_value !== 'number' ||
      !(val.discount_value > 0 && val.discount_value < 100)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['discount_value'],
        message: '할인률은 0~99 사이여야 합니다.',
      })
    }
  }

  if (val.discount_type === 'fixed') {
    if (typeof val.discount_value !== 'number' || !(val.discount_value > 0)) {
      ctx.addIssue({
        code: 'custom',
        path: ['discount_value'],
        message: '할인가는 0보다 커야 합니다.',
      })
    }
  }
}
function toKstIsoOrNull(v: unknown): string | null {
  if (v === '' || v === null || v === undefined) return null
  if (v instanceof Date) return new Date(v.getTime()).toISOString()
  if (typeof v !== 'string') return null

  const s = v.trim()
  if (!s) return null

  const hasTz = /Z$|[+-]\d{2}:?\d{2}$/.test(s)
  if (hasTz) {
    const t = Date.parse(s)
    return Number.isNaN(t) ? null : new Date(t).toISOString()
  }

  // datetime-local: YYYY-MM-DDTHH:mm(:ss)
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/)
  if (!m) {
    const t = Date.parse(s)
    return Number.isNaN(t) ? null : new Date(t).toISOString()
  }

  const [, y, mo, d, hh, mm, ss] = m
  const utcMs = Date.UTC(
    Number(y),
    Number(mo) - 1,
    Number(d),
    Number(hh) - 9,
    Number(mm),
    Number(ss ?? '0'),
  )
  return new Date(utcMs).toISOString()
}

const timestampNullable = z
  .preprocess((v) => toKstIsoOrNull(v), z.string().nullable())
  .refine((s) => s === null || !Number.isNaN(Date.parse(s)), {
    message: '날짜 형식이 올바르지 않습니다.',
  })

export const CouponSchema = z
  .object({
    id: z.coerce.number().int().positive().optional(),
    name: z.string().trim().min(1, '쿠폰명은 필수입니다.'),
    description: z.string().nullable().optional(),

    discount_type: discountTypeSchema.default('rate'),
    discount_value: z.coerce.number().int({ error: '할인값은 정수여야 합니다.' }),

    max_discount: z.coerce
      .number()
      .int()
      .gt(1, { error: '최대 할인 금액은 1보다 커야 합니다.' })
      .nullable(),

    min_order_amount: z.coerce
      .number()
      .int()
      .gt(1, { error: '최소 주문 금액은 1보다 커야 합니다.' })
      .nullable(),

    is_active: z.boolean().default(true),
    expiration_date: z.string().nullable().optional(),
    starts_at: timestampNullable,
    ends_at: timestampNullable,

    stackable: z.boolean().default(false),

    max_issue: z.coerce.number().int().positive().nullable(),
    max_redemptions: z.coerce.number().int().positive().nullable(),
    max_per_user: z.coerce
      .number()
      .int()
      .gt(1, { error: '사용 횟수는 1이상 이어야 합니다.' })
      .default(1),

    created_by: z.uuid().nullable(),

    notes: z.string().nullable().optional(),

    coupon_kind: couponKindSchema,
    coupon_code: z
      .preprocess((v) => {
        if (v === '' || v === null || v === undefined) return null
        if (typeof v !== 'string') return null
        const s = v.trim()
        return s ? s.toUpperCase() : null
      }, z.string().max(64).nullable())
      .refine((s) => s === null || /^[A-Z0-9_-]+$/.test(s), {
        message: '쿠폰 코드는 영문 대문자/숫자/(_,-)만 허용합니다.',
      }),

    product_mode: applyModeSchema,
    category_mode: applyModeSchema,
  })
  .superRefine((val, ctx) => {
    // (starts_at <= ends_at) 체크
    if (val.starts_at && val.ends_at) {
      const s = Date.parse(val.starts_at)
      const e = Date.parse(val.ends_at)

      if (!Number.isNaN(s) && !Number.isNaN(e) && s > e) {
        ctx.addIssue({
          code: 'custom',
          path: ['ends_at'],
          message: '종료일은 시작일 이후여야 합니다.',
        })
      }
    }
  })
  .superRefine(validateDiscountRule)
