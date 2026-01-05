export const coerceId = (id: string | number) => {
  if (typeof id === 'number') return id

  const s = id.trim()
  if (s === '') return id

  const n = Number(s)
  return Number.isFinite(n) ? n : id
}
