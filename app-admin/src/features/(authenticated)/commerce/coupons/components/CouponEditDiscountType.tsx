'use client'

import React from 'react'
import { MoveRight } from 'lucide-react'
import ServerForm from '@/components/form/ServerForm'
import type { FormState } from '@/types/FormState'
import { useSetAtom } from 'jotai'
import { articleButtonAtom } from '@/store/articleEditAtoms'
import { DiscountType } from '@/types/enum'
import FormSelect from '@/components/form/FormSelect'
import { DISCOUNT_TYPE_META } from '@/schema/DiscountTypeMeta'
import FormInput from '@/components/form/FormInput'
import AppButton from '@/components/ui/AppButton'
import { updateDiscountTypeAction } from '@/features/(authenticated)/commerce/coupons/update/updateDiscountTypeAction'
import { CouponUpdateDiscountTypeFormValues } from '@/features/(authenticated)/commerce/coupons/update/updateSchema'

const initialCouponState = ({
  discount_value,
  discount_type,
}: {
  discount_value?: number
  discount_type?: DiscountType
}): FormState<CouponUpdateDiscountTypeFormValues> => ({
  values: {
    discount_value,
    discount_type,
  },
  fieldErrors: {},
  success: false,
})

export default function CouponEditDiscountType({
  discount_value,
  discount_type,
  id,
}: {
  discount_value?: number
  discount_type?: DiscountType
  id: number
}) {
  const setId = useSetAtom(articleButtonAtom)
  const [discountType, setDiscountType] = React.useState<DiscountType>(
    (discount_type as DiscountType) ?? 'fixed',
  )
  const close = React.useCallback(() => setId(''), [setId])

  return (
    <div className="relative flex size-full flex-col gap-1 rounded bg-white">
      <h3 className="absolute top-0 left-0 flex items-center gap-3 rounded-br border-r border-b border-gray-300 bg-gray-300 px-2 py-0.5 text-xs">
        <p className="flex items-center gap-3">
          할인 타입 변경 <MoveRight size={14} />{' '}
        </p>
        <p className="text-sm font-bold text-red-500">
          기존 타입( {discount_value?.toLocaleString()} {discount_type === 'fixed' ? '원' : '%'} )
        </p>
      </h3>

      <ServerForm<FormState<CouponUpdateDiscountTypeFormValues>>
        action={updateDiscountTypeAction.bind(null, id)}
        className="size-full p-3"
        initialState={initialCouponState({
          discount_value,
          discount_type,
        })}
      >
        {({ state, isPending }) => (
          <CouponUpdateBody
            discountValue={discount_value}
            discountType={discountType}
            setDiscountType={setDiscountType}
            state={state}
            isPending={isPending}
            onClose={close}
          />
        )}
      </ServerForm>
    </div>
  )
}

function CouponUpdateBody({
  discountValue,
  discountType,
  setDiscountType,
  state,
  isPending,
  onClose,
}: {
  discountValue?: number
  discountType: DiscountType
  setDiscountType: React.Dispatch<React.SetStateAction<DiscountType>>
  state: FormState<CouponUpdateDiscountTypeFormValues>
  isPending: boolean
  onClose: () => void
}) {
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
      {/* 폼 바디 */}
      <div>
        <div className="grid grid-cols-2 gap-3">
          {/* 할인 타입 */}
          <div className="space-y-1">
            <FormSelect
              label="할인 타입"
              className="h-7"
              name="discount_type"
              options={Object.entries(DISCOUNT_TYPE_META)
                .filter(([key]) => key !== 'none')
                .map(([key, meta]) => ({
                  value: key as DiscountType,
                  label: meta.label,
                  icon: meta.icon,
                }))}
              defaultValue={discountType}
              onChange={(e) => setDiscountType(e.target.value as DiscountType)}
              errorMessage={state.fieldErrors?.['discount_type']?.[0]}
            />
            <p className="text-[11px] text-gray-500">할인 정책을 선택합니다</p>
          </div>
          <FormInput
            label={`할인${discountType === 'rate' ? '율 ( % )' : '가 ( ₩ )'}`}
            name="discount_value"
            required
            type="number"
            className="h-7"
            placeholder={`예) ${discountType === 'rate' ? '30 %' : '19,900 ₩'}`}
            defaultValue={state.values?.discount_value ?? discountValue}
            errorMessage={state.fieldErrors?.['discount_value']?.[0]}
          />
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
        <AppButton type="button" variant="cancel" disabled={isPending} onClick={onClose}>
          취소
        </AppButton>
        <AppButton type="submit" variant="update" disabled={isPending}>
          {isPending ? '변경 중…' : '변경'}
        </AppButton>
      </div>
    </div>
  )
}
