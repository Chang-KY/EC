import * as z from 'zod'

function pathKey(path: readonly PropertyKey[] = []) {
  let key = ''
  for (const seg of path) {
    if (typeof seg === 'number') key += `[${seg}]`
    else if (typeof seg === 'string') key += (key ? '.' : '') + seg
    else {
      key += (key ? '.' : '') + String(seg)
    }
  }
  return key
}

export function zodIssuesToFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string[]> = {}
  const formErrors: string[] = []

  for (const issue of error.issues) {
    const key = pathKey(issue.path)
    if (!key) {
      formErrors.push(issue.message)
      continue
    }
    ;(fieldErrors[key] ??= []).push(issue.message)
  }

  return { fieldErrors, formErrors }
}
