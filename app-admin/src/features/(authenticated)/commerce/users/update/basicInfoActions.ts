'use server'

import { ROUTES } from '@/constants/routes'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/utils/supabase/supabase'
import {
  usersUpdateFormValue,
  usersUpdateSchema,
} from '@/features/(authenticated)/commerce/users/userSchema'

async function updateUser(userId?: string, patch?: usersUpdateFormValue) {
  if (!userId) return { ok: false as const, message: 'Invalid Profile ID' }
  if (!patch || Object.keys(patch).length === 0)
    return { ok: false as const, message: 'No fields to update' }

  const sb = await supabase()
  const { error } = await sb.schema('ec').from('profiles').update(patch).eq('id', userId)
  if (error) return { ok: false as const, message: error.message }

  revalidatePath(`${ROUTES.USERS}/${userId}`)
  return { ok: true as const }
}

export async function userUpdateNameAction(data: usersUpdateFormValue) {
  const { id: userId, name } = usersUpdateSchema.parse(data)
  return updateUser(userId, { name })
}

export async function userUpdatePhoneAction(data: usersUpdateFormValue) {
  const { id: userId, phone } = usersUpdateSchema.parse(data)
  return updateUser(userId, { phone })
}
