import { z } from 'zod'
import {
  adminStatusSchema,
  levelSchema,
  userRoleSchema,
} from '@/features/(authenticated)/system/admins/schema'

export const adminProfileSchema = z
  .object({
    email: z.email('올바른 이메일 형식이 아닙니다.'),
    name: z.string().max(20, '이름은 20자 이하로 입력해 주세요.').optional().or(z.literal('')),
    phone: z.string().max(20, '전화번호는 20자 이하로 입력해 주세요.').optional().or(z.literal('')),
    status: adminStatusSchema,
    role: userRoleSchema,
    level: levelSchema,
  })
  .extend({
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .max(40, '비밀번호는 40자 이하로 입력해 주세요.'),
    passwordConfirm: z.string().min(8, '비밀번호 확인도 최소 8자 이상이어야 합니다.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  })

export type AdminCreateFormValues = z.infer<typeof adminProfileSchema>
