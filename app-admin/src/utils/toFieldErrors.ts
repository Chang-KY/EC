import { z } from 'zod'

export function toFieldErrors(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join('.') : '_form'

    if (!result[key]) {
      result[key] = []
    }

    result[key].push(issue.message)
  }

  if (!result._form) {
    result._form = []
  }

  return result
}
