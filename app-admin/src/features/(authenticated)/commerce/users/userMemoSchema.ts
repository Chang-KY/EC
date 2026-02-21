import { z } from 'zod'

/** enum: ec.memo_visibility */
export const MemoVisibilitySchema = z.enum(['public', 'private'])

/** 빈 문자열 -> null */
const trimToNull = (v: unknown) => {
  if (typeof v !== 'string') return v
  const t = v.trim()
  return t === '' ? null : t
}

export const UserMemoRowSchema = z
  .object({
    id: z.number().int().positive(),
    profile_id: z.uuid(),
    admin_id: z.uuid().nullable(),
    memo: z.string().min(1),

    visibility: MemoVisibilitySchema,

    is_deleted: z.boolean(),
    deleted_at: z.coerce.date().nullable(),
    deleted_by: z.uuid().nullable(),
  })
  .superRefine((row, ctx) => {
    if (row.is_deleted === false) {
      if (row.deleted_at !== null || row.deleted_by !== null) {
        ctx.addIssue({
          code: 'custom',
          message:
            'System Error: is_deleted=false이면 deleted_at/deleted_by는 반드시 null이어야 함',
          path: ['is_deleted'],
        })
      }
    } else {
      if (row.deleted_at === null || row.deleted_by === null) {
        ctx.addIssue({
          code: 'custom',
          message:
            'System Error: is_deleted=true이면 deleted_at/deleted_by는 반드시 값이 있어야 함',
          path: ['is_deleted'],
        })
      }
    }
  })

export type UserMemoRow = z.infer<typeof UserMemoRowSchema>

/* =========================================================
 * Update (메모 내용/공개범위 수정)
 * ======================================================= */
export const UserMemoUpdateSchema = z
  .object({
    id: z.number().int().positive(),
    memo: z
      .preprocess(trimToNull, z.string().min(1, '메모는 비어있으면 안 됨').max(2000))
      .optional(),

    visibility: MemoVisibilitySchema.optional(),
  })
  .strict()
  .refine((v) => v.memo !== undefined || v.visibility !== undefined, {
    message: '수정할 필드를 최소 1개 이상 보내야 함',
  })

export type UserMemoUpdateInput = z.infer<typeof UserMemoUpdateSchema>

export const UserMemoSoftDeleteSchema = z
  .object({
    id: z.number().int().positive(),
    is_deleted: z.literal(true),
    deleted_by: z.uuid().optional(),
  })
  .strict()

export type UserMemoSoftDeleteInput = z.infer<typeof UserMemoSoftDeleteSchema>
