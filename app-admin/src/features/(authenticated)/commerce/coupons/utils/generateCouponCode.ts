const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function generateRawCode(len: number): string {
  while (true) {
    let result = ''

    for (let i = 0; i < len; i++) {
      const idx = Math.floor(Math.random() * CHARSET.length)
      result += CHARSET[idx]
    }

    const hasLetter = /[A-Z]/.test(result)
    const hasDigit = /[0-9]/.test(result)

    if (hasLetter && hasDigit) {
      return result
    }
  }
}

export function generateCouponCode(len: number): string {
  // 문자 16개 생성
  const raw = generateRawCode(len)

  // 8자리-8자리 형태로 포맷 → 전체 길이 17 (8 + 1 + 8)
  return `${raw.slice(0, 8)}-${raw.slice(8)}`
}
