import { CategoryRowSchema } from '@/features/(authenticated)/commerce/categories/categoriesSchema'
import { z } from 'zod'

export const categoriesUpdateSchema = CategoryRowSchema.partial()

export type CategoryUpdateUpdateFormValue = z.infer<typeof categoriesUpdateSchema>
