'use server'

import { redirect } from 'next/navigation'
import { loginSchema } from './schema'
import { ROUTES } from '@/constants/routes'
import { LoginFormState } from '@/features/(public)/login/types'
import { loginWithEmailPassword } from '@/features/(public)/login/service'

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const parsed = loginSchema.safeParse({ email, password })

  if (!parsed.success) {
    const flat = parsed.error.flatten((issue) => issue.message)

    return {
      ok: false,
      message: '입력값을 다시 확인해 주세요.',
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
      ok: false,
      message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      fieldErrors: {},
      values: { email: parsed.data.email },
    }
  }

  redirect(ROUTES.DASHBOARD)
}
