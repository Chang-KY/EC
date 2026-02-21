import { Percent, Banknote } from 'lucide-react'
import { DiscountType } from '@/types/enum'

export function getDiscountTypeMeta(type: DiscountType) {
  switch (type) {
    case 'rate':
      return {
        label: '비율',
        Icon: Percent,
        className: 'text-indigo-600 dark:text-indigo-300',
      }
    case 'fixed':
      return {
        label: '정액',
        Icon: Banknote,
        className: 'text-emerald-600 dark:text-emerald-300',
      }
    default:
      return {
        label: '-',
        Icon: null,
        className: '',
      }
  }
}

export function formatDiscountValue(
  kind: 'rate' | 'fixed' | 'none',
  value: number | string | null | undefined,
) {
  if (value === null || value === undefined || value === '') return '-'

  const num = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(num)) return String(value)

  if (kind === 'rate') return `${num} %`
  if (kind === 'fixed') return new Intl.NumberFormat('ko-KR').format(num) + ' ₩'

  return String(value)
}
