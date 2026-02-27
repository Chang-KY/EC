import { z } from 'zod'
import { KeyRound, Ticket } from 'lucide-react'
import { Meta } from '@/types/Meta'
import { applyModeSchema } from '@/features/(authenticated)/commerce/coupons/applyModeSchema'

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
  // KST(+09:00)를 UTC로 환산해서 ISO(Z) 생성
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

export const CouponCreateSchema = z
  .object({
    id: z.coerce.number().int().positive().optional(),
    name: z.string().trim().min(1, '쿠폰명은 필수입니다.'),
    description: z.string().nullable().optional(),

    discount_type: z.string().min(1),
    discount_value: z.number().int().positive(), // check(discount_value > 0)

    max_discount: z.number().int().min(1).nullable(), // null or >= 0
    min_order_amount: z.number().int().min(1).nullable(), // null or >= 0

    is_active: z.boolean().default(true),
    expiration_date: z.string().nullable().optional(),
    starts_at: timestampNullable,
    ends_at: timestampNullable,

    stackable: z.boolean().default(false),

    max_issue: z.number().int().positive().nullable(),
    max_redemptions: z.number().int().positive().nullable(),
    max_per_user: z.number().int().min(1).default(1),

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
