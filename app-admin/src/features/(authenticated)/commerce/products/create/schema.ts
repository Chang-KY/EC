import { z } from 'zod'
import {
  DiscountType,
  discountTypeSchema,
  ProductStatus,
  productStatusSchema,
} from '@/features/(authenticated)/commerce/products/productsSchema'
import { BadgePercent, Eye, EyeOff, LucideIcon, PackageX, Tag } from 'lucide-react'
import { productImageSchema } from '@/features/(authenticated)/commerce/products/productImageSchema'

export const PRODUCT_STATUS_META = {
  hidden: { label: '숨김', icon: EyeOff, className: 'text-zinc-600 dark:text-zinc-300' },
  active: { label: '노출', icon: Eye, className: 'text-emerald-600 dark:text-emerald-300' },
  sold_out: {
    label: '매진',
    icon: PackageX,
    className: 'text-rose-600 dark:text-rose-300',
  },
} as const satisfies Record<ProductStatus, { label: string; icon: LucideIcon; className: string }>

export const DISCOUNT_TYPE_META = {
  none: { label: '할인 없음', icon: Tag },
  fixed: { label: '가격 할인', icon: Tag },
  rate: { label: '할인율', icon: BadgePercent },
} as const satisfies Record<DiscountType, { label: string; icon: LucideIcon; className?: string }>

export const productsSchema = z
  .object({
    id: z.coerce.number().int().positive().optional(),
    name: z.string().trim().min(1, '상품명을 입력해 주세요.'),
    description: z.string().trim().optional(),
    price: z.coerce.number().int().nonnegative('0 이상이어야 합니다.'),
    discount_type: discountTypeSchema,
    sale_price: z.coerce.number().int().nonnegative().optional(),
    sale_rate: z.coerce.number().int().min(0).max(100).optional(),
    stock: z.coerce.number().int().nonnegative().optional().default(0),
    status: productStatusSchema,
  })
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
      // sale_price는 서버에서 계산하거나 DB에서 계산하면 굳이 저장 안 해도 됨
      base.sale_price = undefined
    }

    return base
  })

export type ProductInput = z.infer<typeof productsSchema>

export const productImagesCreateSchema = z
  .array(productImageSchema)
  .default([])
  .superRefine((imgs, ctx) => {
    const hasThumb = imgs.some((img) => img.role === 'thumbnail')
    if (!hasThumb) {
      ctx.addIssue({
        code: 'custom',
        message: '썸네일 이미지는 최소 1개 필요합니다.',
        path: [],
      })
    }
  })

export type ProductImagesInput = z.infer<typeof productsSchema>

export const productFormSchema = z.object({
  products: productsSchema,
  images: productImagesCreateSchema, // (혹은 너의 productImagesCreateSchema)
})

export type ProductCreateFormValues = z.infer<typeof productFormSchema>
