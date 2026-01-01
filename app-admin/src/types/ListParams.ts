import { z } from 'zod'

export const listParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  keyword: z.string().optional().default(''),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  orderBy: z.string().optional().default('id'),
})

export type ListParams = z.input<typeof listParamsSchema>
