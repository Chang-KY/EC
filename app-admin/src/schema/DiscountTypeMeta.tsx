import { BadgePercent, type LucideIcon, Tag, X } from 'lucide-react'
import { z } from 'zod'

export const discountTypeSchema = z
  .enum(['none', 'rate', 'fixed'] as const) // 예시
  .default('none')
export type DiscountType = z.infer<typeof discountTypeSchema>

export const DISCOUNT_TYPE_META = {
  none: { label: '할인 없음', icon: X },
  fixed: { label: '가격 할인', icon: Tag },
  rate: { label: '할인율', icon: BadgePercent },
} as const satisfies Record<DiscountType, { label: string; icon: LucideIcon }>