export function sanitizeFileName(name: string) {
  // 확장자 제거
  const base = name.replace(/\.[^/.]+$/, '')

  // 한글/영문/숫자/._- 만 남기고 나머지 제거 + 공백 -> -
  const safe = base
    .normalize('NFKD')
    .replace(/[^\w.\-가-힣 ]+/g, '')
    .trim()
    .replace(/\s+/g, '-')

  // 너무 길면 잘라내기(스토리지 키 가독성/안정성)
  return safe.slice(0, 60) || 'file'
}
