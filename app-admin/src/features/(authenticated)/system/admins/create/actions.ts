'use server'

import { adminProfileSchema, type AdminCreateFormValues } from './schema'
import { FormState } from '@/types/FormState'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { ROUTES } from '@/constants/routes'
import { createAdminWithAuth } from '@/features/(authenticated)/system/admins/create/service'
import { revalidatePath } from 'next/cache'

export async function adminCreateAction(
  prev: FormState<AdminCreateFormValues>,
  formData: FormData,
): Promise<FormState<AdminCreateFormValues>> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = adminProfileSchema.safeParse(raw)

  if (!parsed.success) {
    const { fieldErrors, formErrors } = z.flattenError(parsed.error)

    return {
      ...prev,
      values: {
        ...prev.values,
        ...raw,
      } as Partial<AdminCreateFormValues>,
      fieldErrors,
      success: false,
    }
  }
  const values = parsed.data

  try {
    await createAdminWithAuth(values)
  } catch (error) {
    return {
      ...prev,
      values: {
        ...values,
      },
      fieldErrors: {},
      success: false,
    }
  }

  revalidatePath(ROUTES.ADMINS)
  redirect(ROUTES.ADMINS)
}
