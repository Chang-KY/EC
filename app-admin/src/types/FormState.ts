export type FormState<T> = {
  values: Partial<T>
  fieldErrors: Record<string, string[]> & { _form?: string[] }
  success: boolean
}
