import React from 'react'
import Input from '@/components/ui/Input'
import { useGetProductsForCoupon } from '@/features/(authenticated)/commerce/coupons/hooks/useGetProductsForCoupon'
import { useKeywordSetParam } from '@/hooks/params/useKeywordSetParam'
import Loading from '@/components/loading/Loading'
import { Loader2, Package, Search } from 'lucide-react'
import { PRODUCTS_TABLE } from '@/types/db'
import { Check, Plus } from 'lucide-react'
import { SelectedProductRow } from '@/features/(authenticated)/commerce/coupons/components/CouponProductsRow'

type SearchProductProps = {
  selectedProducts: PRODUCTS_TABLE['Row'][]
  onSelectProduct: (product: PRODUCTS_TABLE['Row']) => void
}

export default function SearchProduct({ selectedProducts, onSelectProduct }: SearchProductProps) {
  const { keyword, setKeyword, isDebouncing, flush } = useKeywordSetParam(700, '')
  const { items, hasNextPage, fetchNextPage, isFetchingNextPage, isPending, isError } =
    useGetProductsForCoupon({ keyword })
  const isSearching = isDebouncing || isPending
  const selectedIds = React.useMemo(() => {
    return new Set(selectedProducts.map((product) => product.id))
  }, [selectedProducts])
  const bottomRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const target = bottomRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage().then()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div className="w-full space-y-3">
      <div className="mt-3 flex w-full items-center justify-between gap-3">
        <div className="flex w-48 items-center gap-2">
          <p className="w-10 shrink-0 text-xs text-gray-600">상품 명</p>
          <Input
            value={keyword}
            type="text"
            name="search"
            icon={
              isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />
            }
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Nike Force"
            className="h-7 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') flush()
            }}
          />
        </div>

        <div className="inline-flex h-7 min-w-28 items-center justify-center gap-1 rounded border border-indigo-200 bg-indigo-50 px-2.5 text-[11px] font-medium text-indigo-700">
          <Package className="size-3.5" />
          <span className="w-3 text-center">{selectedProducts.length}</span>
          <span>개 선택됨</span>
        </div>
      </div>

      <div className="flex max-h-100 min-h-100 w-full items-start justify-center rounded border border-gray-300">
        {isPending ? (
          <div className="flex h-100 items-center justify-center">
            <Loading mention="상품 데이터를 가져오는 중..." />
          </div>
        ) : isError ? (
          <div className="flex h-100 w-full items-center justify-center">
            <p className="text-xs text-red-500">에러가 발생했습니다.</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-100 items-center justify-center">
            <p className="text-xs">
              {keyword ? <span className="mr-3 text-red-700">{keyword}</span> : ''}상품이 존재하지
              않습니다.
            </p>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col rounded">
            <div className="grid grid-cols-[56px_minmax(0,1fr)_120px_100px_88px] items-center gap-2 rounded-tl rounded-tr border-b border-gray-200 bg-gray-50 px-3 py-2 text-[11px] font-medium text-gray-500">
              <div className="text-center">이미지</div>
              <div className="text-center">상품 정보</div>
              <div className="text-center">가격</div>
              <div className="text-center">재고</div>
              <div className="text-center">선택</div>
            </div>

            <div className="h-[366.41px] divide-y divide-gray-100 overflow-y-auto">
              {items.map((product) => (
                <SelectedProductRow
                  key={product.id}
                  keyword={keyword}
                  product={product}
                  clickButton={
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProduct(product)
                      }}
                      className={
                        selectedIds.has(product.id)
                          ? 'h-7 rounded border border-indigo-200 bg-indigo-50 px-2.5 text-[11px] text-indigo-600'
                          : 'h-7 rounded border border-gray-300 px-2.5 text-[11px] text-gray-700 hover:bg-gray-50'
                      }
                    >
                      {selectedIds.has(product.id) ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                    </button>
                  }
                />
              ))}

              <div ref={bottomRef} className="h-0 w-full" />

              {isFetchingNextPage && (
                <div className="absolute inset-0 flex size-full items-center justify-center">
                  <Loading mention="상품을 더 불러오는 중..." />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
