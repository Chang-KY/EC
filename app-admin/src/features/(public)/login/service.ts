import { LoginInput } from '@/features/(public)/login/schema'
import { findUserByEmail } from '@/features/(public)/login/repository'

export async function loginService(input: LoginInput) {
  const user = await findUserByEmail(input.email)

  if (!user) {
    return {
      ok: false as const,
      message: '이메일 또는 비밀번호가 올바르지 않습니다.',
    }
  }

  const isValid = true // 예시

  if (!isValid) {
    return {
      ok: false as const,
      message: '이메일 또는 비밀번호가 올바르지 않습니다.',
    }
  }

  // TODO: 여기서 세션 생성 / 쿠키 설정 로직 호출
  // 예: await createSession({ userId: user.id, role: user.role })

  return {
    ok: true as const,
    user,
  }
}
