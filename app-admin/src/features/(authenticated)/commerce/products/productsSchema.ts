import { z } from 'zod'
import { BadgePercent, Eye, EyeOff, type LucideIcon, PackageX, Tag, X } from 'lucide-react'
import { Meta } from '@/types/Meta'
import { discountTypeSchema } from '@/schema/DiscountTypeMeta'

export const productStatusSchema = z
  .enum(['hidden', 'active', 'sold_out'] as const) // 예시
  .default('hidden')
export type ProductStatus = z.infer<typeof productStatusSchema>

export const PRODUCT_STATUS_META = {
  hidden: { label: '숨김', icon: EyeOff, className: 'text-zinc-600 dark:text-zinc-300' },
  active: { label: '노출', icon: Eye, className: 'text-emerald-600 dark:text-emerald-300' },
  sold_out: {
    label: '매진',
    icon: PackageX,
    className: 'text-rose-600 dark:text-rose-300',
  },
} as const satisfies Record<ProductStatus, Required<Pick<Meta, 'label' | 'icon' | 'className'>>>

export const productObjectSchema = z.object({
  id: z.coerce.number().int().positive().optional(),

  name: z.string().trim().min(1, '상품명을 입력해 주세요.'),
  description: z.string().trim().optional(),

  price: z.coerce.number().int().nonnegative('0 이상이어야 합니다.'),

  discount_type: discountTypeSchema,
  discount_value: z.coerce.number().int().optional(),

  stock: z.coerce.number().int().nonnegative().optional().default(0),
  status: productStatusSchema,
})
