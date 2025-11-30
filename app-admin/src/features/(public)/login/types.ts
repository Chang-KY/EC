export type LoginFormState = {
  ok: boolean
  message?: string
  fieldErrors?: {
    email?: string[]
    password?: string[]
  }
  values?: {
    email?: string
  }
}
