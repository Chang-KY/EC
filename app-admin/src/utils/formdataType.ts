export function getString(fd: FormData, key: string, fallback = ''): string {
  const value = fd.get(key)
  return typeof value === 'string' ? value : fallback
}

export function getNullableString(fd: FormData, key: string): string | null {
  const value = fd.get(key)
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

export function getNumber(fd: FormData, key: string, fallback: number): number {
  const value = fd.get(key)
  if (typeof value !== 'string' || value.trim() === '') return fallback
  return Number(value)
}

export function getNullableNumber(fd: FormData, key: string): number | null {
  const value = fd.get(key)
  if (typeof value !== 'string' || value.trim() === '') return null
  return Number(value)
}

export function getBoolean(fd: FormData, key: string): boolean {
  const value = fd.get(key)
  return value === 'true' || value === 'on'
}
