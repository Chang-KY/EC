import { z } from 'zod'
import { List, ListMinus, ListPlus } from 'lucide-react'
import { Meta } from '@/types/Meta'

const idArray = z
  .array(z.coerce.number().int().positive())
  .default([])
  .superRefine((arr, ctx) => {
    const set = new Set(arr)
    if (set.size !== arr.length) {
      ctx.addIssue({
        code: 'custom',
        message: '중복된 ID가 포함되어 있습니다.',
      })
    }
  })

export const CouponTargetsSchema = z.object({
  products: idArray, // product_id[]
  categories: idArray, // category_id[]
})

export function validateCouponTargets(
  coupons: {
    product_mode: ApplyMode
    category_mode: ApplyMode
  },
  targets: { products: unknown[]; categories: unknown[] },
  ctx: z.RefinementCtx,
) {
  // product_mode
  if (coupons.product_mode === 'all') {
    if (targets.products.length > 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['targets', 'products'],
        message: '상품 적용 모드가 all이면 상품 선택은 비워야 합니다.',
      })
    }
  } else {
    if (targets.products.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['targets', 'products'],
        message: '상품 적용 모드가 include/exclude이면 상품을 1개 이상 선택해야 합니다.',
      })
    }
  }

  // category_mode
  if (coupons.category_mode == null || coupons.category_mode === 'all') {
    if (targets.categories.length > 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['targets', 'categories'],
        message: '카테고리 적용 모드가 null/all이면 카테고리 선택은 비워야 합니다.',
      })
    }
  } else {
    if (targets.categories.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['targets', 'categories'],
        message: '카테고리 적용 모드가 include/exclude이면 카테고리를 1개 이상 선택해야 합니다.',
      })
    }
  }
}

export const applyModeSchema = z
  .enum(['exclude', 'include', 'all'] as const) // 예시
  .default('all')

export type ApplyMode = z.infer<typeof applyModeSchema>

export const APPLY_MODE_META = {
  all: {
    label: '전체 적용',
    icon: List,
    className: 'text-zinc-600 dark:text-zinc-300',
  },
  include: {
    label: '선택 항목만 적용',
    icon: ListPlus,
    className: 'text-emerald-600 dark:text-emerald-300',
  },
  exclude: {
    label: '선택 항목 제외',
    icon: ListMinus,
    className: 'text-rose-600 dark:text-rose-300',
  },
} as const satisfies Record<ApplyMode, Required<Pick<Meta, 'label' | 'icon' | 'className'>>>
