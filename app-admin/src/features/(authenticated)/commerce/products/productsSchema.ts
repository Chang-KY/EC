import { z } from 'zod'
import { BadgePercent, Eye, EyeOff, type LucideIcon, PackageX, Tag, X } from 'lucide-react'
import { Meta } from '@/types/Meta'

export const productStatusSchema = z
  .enum(['hidden', 'active', 'sold_out'] as const) // 예시
  .default('hidden')
export type ProductStatus = z.infer<typeof productStatusSchema>

export const discountTypeSchema = z
  .enum(['none', 'rate', 'fixed'] as const) // 예시
  .default('none')
export type DiscountType = z.infer<typeof discountTypeSchema>

export const PRODUCT_STATUS_META = {
  hidden: { label: '숨김', icon: EyeOff, className: 'text-zinc-600 dark:text-zinc-300' },
  active: { label: '노출', icon: Eye, className: 'text-emerald-600 dark:text-emerald-300' },
  sold_out: {
    label: '매진',
    icon: PackageX,
    className: 'text-rose-600 dark:text-rose-300',
  },
} as const satisfies Record<ProductStatus, Required<Pick<Meta, 'label' | 'icon' | 'className'>>>

export const DISCOUNT_TYPE_META = {
  none: { label: '할인 없음', icon: X },
  fixed: { label: '가격 할인', icon: Tag },
  rate: { label: '할인율', icon: BadgePercent },
} as const satisfies Record<DiscountType, { label: string; icon: LucideIcon }>

export const productObjectSchema = z.object({
  id: z.coerce.number().int().positive().optional(),

  name: z.string().trim().min(1, '상품명을 입력해 주세요.'),
  description: z.string().trim().optional(),

  price: z.coerce.number().int().nonnegative('0 이상이어야 합니다.'),
  discount_type: discountTypeSchema,

  sale_price: z.coerce.number().int().nonnegative().optional(),
  sale_rate: z.coerce
    .number()
    .int()
    .min(0, '0%보다 커야합니다.')
    .max(100, '100% 보다 작아야합니다.')
    .optional(),

  stock: z.coerce.number().int().nonnegative().optional().default(0),
  status: productStatusSchema,
})
