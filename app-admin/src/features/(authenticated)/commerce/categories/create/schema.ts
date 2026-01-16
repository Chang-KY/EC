import { z } from 'zod'

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug는 소문자/숫자/하이픈만 허용합니다.'),
  parent_id: z.number().int().positive().nullable().optional(),
  selectable: z.boolean().optional().default(false),
})

export type CategoriesCreateFormValues = z.infer<typeof CreateCategorySchema>
