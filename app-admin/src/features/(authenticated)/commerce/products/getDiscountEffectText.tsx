import { DiscountType } from '@/types/enum'

const formatWon = (n: number) => `${Math.round(n).toLocaleString()}원`
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

export function getDiscountEffectText(params: {
  price?: number | null
  discountTypeKey?: DiscountType | null
  discountValue?: number | null
}) {
  const price = params.price ?? null
  const type = params.discountTypeKey ?? 'none'
  const discountValue = params.discountValue ?? null

  if (price == null || price <= 0) return '-'

  if (type === 'fixed') {
    if (discountValue == null || Number.isNaN(Number(discountValue))) return '-'

    // 할인 금액(원)
    const amount = clamp(Number(discountValue), 0, price)
    const discountWon = Math.round(amount)
    const final = Math.max(0, price - discountWon)
    const discountPct = price > 0 ? (discountWon / price) * 100 : 0

    return (
      <p className="flex flex-nowrap items-center gap-1.5 overflow-x-auto text-xs">
        <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 font-medium text-rose-700">
          {formatWon(discountWon)} 할인
        </span>
        <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
          {discountPct.toFixed(1)}%
        </span>
        <span className="mx-0.5 text-gray-400">→</span>
        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
          {formatWon(final)}
        </span>
      </p>
    )
  }

  if (type === 'rate') {
    if (discountValue == null || Number.isNaN(Number(discountValue))) return '-'

    // 할인율(%)
    const pct = clamp(Number(discountValue), 0, 100)
    const discountWon = Math.round((price * pct) / 100)
    const final = Math.max(0, price - discountWon)

    return (
      <p className="flex flex-nowrap items-center gap-1.5 overflow-x-auto text-xs">
        <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
          {pct}%
        </span>
        <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 font-medium text-rose-700">
          {formatWon(discountWon)} 할인
        </span>
        <span className="mx-0.5 text-gray-400">→</span>
        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
          {formatWon(final)}
        </span>
      </p>
    )
  }

  return '-'
}
