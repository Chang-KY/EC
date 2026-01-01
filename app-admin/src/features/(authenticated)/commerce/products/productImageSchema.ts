import { z } from 'zod'

export const productImageRoleSchema = z.enum(['thumbnail', 'gallery', 'detail'] as const)

export const productImageSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  product_id: z.coerce.number().int().positive().optional(),
  role: productImageRoleSchema,
  storage_path: z.string().min(1, '이미지 경로가 필요합니다.'),
  sort_order: z.coerce.number().int().min(0).default(0),
  alt: z.string().trim().optional(),
  width: z.coerce.number().int().positive().optional(),
  height: z.coerce.number().int().positive().optional(),
  mime_type: z.string().trim().optional(),
})

export type ProductImage = z.infer<typeof productImageSchema>
