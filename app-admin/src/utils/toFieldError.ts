import { ZodError } from 'zod'

type ZodIssueLike = {
  message?: string
}

export const toErrorMessages = (error: unknown): string[] => {
  if (error instanceof ZodError) {
    return error.issues.map((issue) => issue.message)
  }

  if (error instanceof Error) {
    const raw = error.message?.trim()

    if (!raw) {
      return ['요청 처리 중 오류가 발생했습니다.']
    }

    // 서버에서 Zod issues 배열 문자열이 message로 넘어온 경우
    if (raw.startsWith('[')) {
      try {
        const parsed = JSON.parse(raw) as ZodIssueLike[]

        if (Array.isArray(parsed)) {
          const messages = parsed
            .map((item) => item?.message)
            .filter((message): message is string => Boolean(message))

          if (messages.length > 0) {
            return messages
          }
        }
      } catch {
        // JSON 파싱 실패하면 그냥 원문 사용
      }
    }

    return [raw]
  }

  return ['요청 처리 중 오류가 발생했습니다.']
}
