'use server'

import { redirect } from 'next/navigation'
import { LoginFormValues, loginSchema } from './schema'
import { ROUTES } from '@/constants/routes'
import { loginWithEmailPassword } from '@/features/(public)/login/service'
import { FormState } from '@/types/FormState'

export async function loginAction(
  _prevState: FormState<LoginFormValues>,
  formData: FormData,
): Promise<FormState<LoginFormValues>> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const parsed = loginSchema.safeParse({ email, password })

  if (!parsed.success) {
    const flat = parsed.error.flatten((issue) => issue.message)

    return {
      success: false,
      fieldErrors: {
        email: flat.fieldErrors.email,
        password: flat.fieldErrors.password,
      },
      values: { email },
    }
  }

  try {
    await loginWithEmailPassword(parsed.data.email, parsed.data.password)
  } catch (_e) {
    return {
      success: false,
      fieldErrors: {
        password: ['이메일 또는 비밀번호가 올바르지 않습니다.'],
      },
      values: { email: parsed.data.email },
    }
  }

  redirect(ROUTES.DASHBOARD)
}
