function toKstStartIso(yyyyMMddDot: string) {
  // "2026.02.11" -> "2026-02-11T00:00:00+09:00"
  const m = yyyyMMddDot.match(/^(\d{4})\.(\d{2})\.(\d{2})$/)
  if (!m) throw new Error('Invalid date format')
  const [, y, mo, d] = m
  return `${y}-${mo}-${d}T00:00:00+09:00`
}

function toKstEndIso(yyyyMMddDot: string) {
  // "2026.03.18" -> "2026-03-18T23:59:59.999+09:00"
  const m = yyyyMMddDot.match(/^(\d{4})\.(\d{2})\.(\d{2})$/)
  if (!m) throw new Error('Invalid date format')
  const [, y, mo, d] = m
  return `${y}-${mo}-${d}T23:59:59.999+09:00`
}

export function parseExpirationRangeText(input: string) {
  const s = (input ?? '').trim()
  if (!s) return null // 무기한

  const parts = s.split('~').map((v) => v.trim())
  const fromText = parts[0]
  const toText = parts[1] ?? ''

  if (!fromText) return null

  return {
    starts_at: toKstStartIso(fromText),
    ends_at: toText ? toKstEndIso(toText) : null, // "2026.02.11 ~" 이런 케이스
  }
}
