export const isFile = (v: unknown): v is File =>
  typeof File !== 'undefined' && v instanceof File && v.size > 0
