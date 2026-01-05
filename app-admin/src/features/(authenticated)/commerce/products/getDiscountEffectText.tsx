import { DiscountType } from '@/types/enum'

const formatWon = (n: number) => `${Math.round(n).toLocaleString()}원`

export function getDiscountEffectText(params: {
  price?: number | null
  discountTypeKey?: DiscountType | null
  sale_price?: number | null
  sale_rate?: number | null
}) {
  const price = params.price ?? null
  const type = params.discountTypeKey ?? 'none'
  const salePrice = params.sale_price ?? null
  const saleRate = params.sale_rate ?? null

  if (price == null || price <= 0) return '-'

  if (type === 'fixed') {
    if (salePrice == null) return '-'
    const final = Math.max(0, salePrice)
    const discountWon = Math.max(0, price - final)
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
    if (saleRate == null) return '-'
    const pct = Math.min(100, Math.max(0, Number(saleRate)))
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
