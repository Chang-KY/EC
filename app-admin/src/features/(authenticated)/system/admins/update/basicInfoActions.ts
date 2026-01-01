'use server'

import { z } from 'zod'
import { ROUTES } from '@/constants/routes'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/utils/supabase/supabase'
import {
  AdminStatus,
  adminStatusSchema,
  Level,
  levelSchema,
  UserRole,
  userRoleSchema,
} from '@/features/(authenticated)/system/admins/schema'

const schema = z.object({
  adminId: z.string(),
  name: z.string().max(20, '이름은 20자 이하로 입력해 주세요.').optional().or(z.literal('')),
  phone: z.string().optional(),
  role: userRoleSchema.optional(),
  level: levelSchema.optional(),
  status: adminStatusSchema.optional(),
})
export type AdminUpdateInput = z.infer<typeof schema>

async function updateAdmin(
  adminId: string,
  patch: { name?: string; phone?: string; role?: UserRole; status?: AdminStatus; level?: Level },
) {
  const sb = await supabase()
  const { error } = await sb.schema('ec').from('admins').update(patch).eq('id', adminId)
  if (error) return { ok: false as const, message: error.message }

  revalidatePath(`${ROUTES.ADMINS}/${adminId}`)
  return { ok: true as const }
}

export async function adminUpdateNameAction(data: AdminUpdateInput) {
  const { adminId, name } = schema.parse(data)
  return updateAdmin(adminId, { name })
}

export async function adminUpdatePhoneAction(data: AdminUpdateInput) {
  const { adminId, phone } = schema.parse(data)
  return updateAdmin(adminId, { phone })
}

export async function adminUpdateRoleAction(data: AdminUpdateInput) {
  const { adminId, role } = schema.parse(data)
  return updateAdmin(adminId, { role })
}

export async function adminUpdateStatusAction(data: AdminUpdateInput) {
  const { adminId, status } = schema.parse(data)
  return updateAdmin(adminId, { status })
}

export async function adminUpdateLevelAction(data: AdminUpdateInput) {
  const { adminId, level } = schema.parse(data)
  return updateAdmin(adminId, { level: level as Level })
}
