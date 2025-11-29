'use server'

import { redirect } from 'next/navigation'
import { loginSchema, type LoginFormState } from './schema'
import { loginService } from './service'
import { ROUTES } from '@/constants/routes'

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = loginSchema.safeParse(raw)

  if (!parsed.success) {
    const flattened = parsed.error.flatten((issue) => issue.message)
    const fieldErrors = flattened.fieldErrors as {
      email?: string[]
      password?: string[]
    }

    return {
      errors: fieldErrors,
      message: '입력값을 확인해주세요.',
    }
  }

  const input = parsed.data

  // 3. 서비스 호출 (도메인 로직)
  const result = await loginService(input)

  if (!result.ok) {
    return {
      message: result.message,
    }
  }

  // 4. 로그인 성공 → 리다이렉트
  redirect(ROUTES.DASHBOARD) // 또는 ROUTES.ADMIN 같은 상수
}
