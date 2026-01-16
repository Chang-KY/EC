import { z } from 'zod'

/**
 * ltree는 보통 "1.2.3" 같은 문자열로 내려오거나,
 * 라이브러리/드라이버에 따라 object로 내려올 수 있어서
 * 우선 string으로 받는 게 실용적임.
 */
export const CategoryPathSchema = z
  .string()
  .min(1, 'path는 비어있을 수 없습니다.')
  .regex(/^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)*$/, 'path 형식이 올바르지 않습니다.')

/** DB Row(조회 결과) */
export const CategoryRowSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    // slug 규칙은 너 정책에 맞춰 조절
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug는 소문자/숫자/하이픈만 허용합니다.'),
  parent_id: z.number().int().positive().nullable(),
  path: CategoryPathSchema,
  depth: z.number().int().positive(), // nlevel(path)라 최소 1
  selectable: z.boolean().nullable().default(false),
})

export type CategoryRow = z.infer<typeof CategoryRowSchema>

/** 목록 */
export const CategoryListSchema = z.array(CategoryRowSchema)

/**
 * Create 입력 스키마
 * - id/depth/path는 DB/트리거에서 만들어야 하니까 입력에서 받지 않는 걸 추천
 * - selectable은 옵션
 */

/**
 * Update 입력 스키마
 * - 보통 name/slug/parent_id/selectable 정도만 수정 가능
 */
export const UpdateCategoryInputSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    slug: z
      .string()
      .min(1)
      .max(200)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug는 소문자/숫자/하이픈만 허용합니다.')
      .optional(),
    parent_id: z.number().int().positive().nullable().optional(),
    selectable: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: '수정할 값이 없습니다.',
  })
