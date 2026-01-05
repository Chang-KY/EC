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
  id: z.string(),
  name: z.string().max(20, '이름은 20자 이하로 입력해 주세요.').optional().or(z.literal('')),
  phone: z.string().optional(),
  role: userRoleSchema.optional(),
  level: levelSchema.optional(),
  status: adminStatusSchema.optional(),
})
export type AdminUpdateInput = z.infer<typeof schema>

async function updateAdmin(
  id: string,
  patch: { name?: string; phone?: string; role?: UserRole; status?: AdminStatus; level?: Level },
) {
  const sb = await supabase()
  const { error } = await sb.schema('ec').from('admins').update(patch).eq('id', id)
  if (error) return { ok: false as const, message: error.message }

  revalidatePath(`${ROUTES.ADMINS}/${id}`)
  return { ok: true as const }
}

export async function adminUpdateNameAction(data: AdminUpdateInput) {
  const { id, name } = schema.parse(data)
  return updateAdmin(id, { name })
}

export async function adminUpdatePhoneAction(data: AdminUpdateInput) {
  const { id, phone } = schema.parse(data)
  return updateAdmin(id, { phone })
}

export async function adminUpdateRoleAction(data: AdminUpdateInput) {
  const { id, role } = schema.parse(data)
  return updateAdmin(id, { role })
}

export async function adminUpdateStatusAction(data: AdminUpdateInput) {
  const { id, status } = schema.parse(data)
  return updateAdmin(id, { status })
}

export async function adminUpdateLevelAction(data: AdminUpdateInput) {
  const { id, level } = schema.parse(data)
  return updateAdmin(id, { level: level as Level })
}
