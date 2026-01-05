'use client'

import ServerForm from '@/components/form/ServerForm'
import type { FormState } from '@/types/FormState'
import React from 'react'
import { ProductUpdateUpdateFormValue } from '@/features/(authenticated)/commerce/products/update/schema'
import { DiscountType } from '@/types/enum'
import { productUpdateAction } from '@/features/(authenticated)/commerce/products/update/action'
import FormInput from '@/components/form/FormInput'
import FormSelect from '@/components/form/FormSelect'
import { DISCOUNT_TYPE_META } from '@/features/(authenticated)/commerce/products/productsSchema'
import Button from '@/components/ui/Button'
import { useSetAtom } from 'jotai'
import { articleButtonAtom } from '@/store/articleEditAtoms'

const initialProductState = ({
  price,
  sale_rate,
  sale_price,
  discount_type,
}: {
  price?: number
  sale_rate?: number
  sale_price?: number
  discount_type?: DiscountType
}): FormState<ProductUpdateUpdateFormValue> => ({
  values: {
    price,
    sale_rate,
    sale_price,
    discount_type,
  },
  fieldErrors: {},
  success: false,
})

export default function ProductEditPriceForm({
  price,
  sale_rate,
  sale_price,
  discount_type,
  id,
}: {
  price?: number
  sale_rate?: number
  sale_price?: number
  discount_type?: DiscountType
  id: number
}) {
  const setId = useSetAtom(articleButtonAtom)

  const [discountType, setDiscountType] = React.useState<DiscountType>(
    (discount_type as DiscountType) ?? 'none',
  )

  const showSalePrice = discountType === 'fixed'
  const showSaleRate = discountType === 'rate'

  const close = React.useCallback(() => setId(''), [setId])

  return (
    <div className="relative flex size-full flex-col gap-1 rounded bg-white">
      <h3 className="absolute top-0 right-0 flex items-center gap-3 rounded-bl border-b border-l border-gray-300 bg-gray-300 px-2 py-0.5 text-xs">
        <p>상품 가격 변경</p>
        <p className="text-[10px] text-indigo-500">표시용 정가( {price?.toLocaleString()} 원 )</p>
      </h3>

      <ServerForm<FormState<ProductUpdateUpdateFormValue>>
        action={productUpdateAction.bind(null, id)}
        className="size-full p-3"
        initialState={initialProductState({
          price,
          sale_price,
          sale_rate,
          discount_type,
        })}
      >
        {({ state, isPending }) => (
          <ProductUpdateBody
            price={price}
            sale_rate={sale_rate}
            sale_price={sale_price}
            discount_type={discount_type}
            discountType={discountType}
            setDiscountType={setDiscountType}
            showSalePrice={showSalePrice}
            showSaleRate={showSaleRate}
            state={state}
            isPending={isPending}
            onClose={close}
          />
        )}
      </ServerForm>
    </div>
  )
}

function ProductUpdateBody({
  price,
  sale_rate,
  sale_price,
  discount_type,
  discountType,
  setDiscountType,
  showSalePrice,
  showSaleRate,
  state,
  isPending,
  onClose,
}: {
  price?: number
  sale_rate?: number
  sale_price?: number
  discount_type?: DiscountType
  discountType: DiscountType
  setDiscountType: React.Dispatch<React.SetStateAction<DiscountType>>
  showSalePrice: boolean
  showSaleRate: boolean
  state: FormState<ProductUpdateUpdateFormValue>
  isPending: boolean
  onClose: () => void
}) {
  // ✅ 성공 후 자동 닫기 (한 번만)
  const closedRef = React.useRef(false)

  React.useEffect(() => {
    if (state.success && !closedRef.current) {
      closedRef.current = true
      onClose()
    }
    // 폼이 다시 열려서 재시도할 수 있게 리셋(필요하면 유지)
    if (!state.success) closedRef.current = false
  }, [state.success, onClose])

  return (
    <div className="flex size-full flex-col justify-between pt-[23px]">
      {/* ✅ 서버액션으로 price도 같이 보내고 싶으면 hidden으로 */}
      <input type="hidden" name="products.price" defaultValue={price ?? 0} />

      {/* 폼 바디 */}
      <div>
        <div className="grid grid-cols-2 gap-3">
          {/* 할인 타입 */}
          <div className="space-y-1">
            <FormSelect
              label="할인 타입"
              className="h-7"
              name="products.discount_type"
              options={Object.entries(DISCOUNT_TYPE_META).map(([value, meta]) => ({
                value: value as DiscountType,
                label: meta.label,
                icon: meta.icon,
              }))}
              defaultValue={discountType}
              onChange={(e) => setDiscountType(e.target.value as DiscountType)}
              errorMessage={state.fieldErrors?.['products.discount_type']?.[0]}
            />
            <p className="text-[11px] text-gray-500">할인 정책을 선택합니다</p>
          </div>

          {/* 조건부 영역 */}
          {showSalePrice && (
            <FormInput
              label="할인가 (원)"
              name="products.sale_price"
              required
              type="number"
              className="h-7"
              placeholder="예: 19,900"
              defaultValue={state.values?.sale_price ?? sale_price}
              errorMessage={state.fieldErrors?.['products.sale_price']?.[0]}
            />
          )}

          {showSaleRate && (
            <FormInput
              label="할인율 (%)"
              name="products.sale_rate"
              required
              type="number"
              className="h-7"
              placeholder="0~100"
              defaultValue={state.values?.sale_rate ?? sale_rate}
              errorMessage={state.fieldErrors?.['products.sale_rate']?.[0]}
            />
          )}

          {!showSalePrice && !showSaleRate && (
            <div className="pt-5">
              <p className="flex h-7 items-center rounded border border-dashed border-gray-200 bg-white px-2 text-xs text-gray-600">
                할인 없음 타입입니다.
              </p>
            </div>
          )}
        </div>

        {/* 폼 에러 */}
        {state.fieldErrors?._form?.[0] && (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {state.fieldErrors._form[0]}
          </div>
        )}
      </div>

      {/* 하단 액션 */}
      <div className="flex items-center justify-end gap-2.5">
        <Button type="button" variant="cancel" disabled={isPending} onClick={onClose}>
          취소
        </Button>
        <Button type="submit" variant="update" disabled={isPending}>
          {isPending ? '변경 중…' : '변경'}
        </Button>
      </div>
    </div>
  )
}
