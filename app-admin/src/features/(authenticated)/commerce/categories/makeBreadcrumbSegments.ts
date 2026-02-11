import { CATEGORIES_TABLE_VIEW } from '@/types/db'

export function makeBreadcrumbSegments(row: CATEGORIES_TABLE_VIEW) {
  const ids = String(row.path ?? '')
    .split('.')
    .map((s) => s.trim())
    .filter(Boolean)

  const names = String(row.breadcrumb ?? '')
    .split('>')
    .map((s) => s.trim())
    .filter(Boolean)

  const len = Math.min(ids.length, names.length)
  if (len === 0) return []

  return Array.from({ length: len }).map((_, i) => ({
    id: ids[i]!,
    name: names[i] ?? ids[i]!,
  }))
}
