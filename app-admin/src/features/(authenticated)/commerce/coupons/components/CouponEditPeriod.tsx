'use client'

import React from 'react'
import { MoveRight } from 'lucide-react'
import ServerForm from '@/components/form/ServerForm'
import type { FormState } from '@/types/FormState'
import { useSetAtom } from 'jotai'
import { articleButtonAtom } from '@/store/articleEditAtoms'
import AppButton from '@/components/ui/AppButton'
import { CouponUpdateFormValues } from '@/features/(authenticated)/commerce/coupons/update/updateSchema'
import { formatPeriod } from '@/features/(authenticated)/commerce/coupons/utils/formatPeriod'
import Label from '@/components/ui/Label'
import DateTimePickerField from '@/components/ui/date-picker/DateTimePickerField'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { updatePeriodAction } from '@/features/(authenticated)/commerce/coupons/update/updatePeriodAction'

const initialCouponState = ({
  starts_at,
  ends_at,
}: {
  starts_at: string | null
  ends_at: string | null
}): FormState<CouponUpdateFormValues> => ({
  values: {
    starts_at,
    ends_at,
  },
  fieldErrors: {},
  success: false,
})

export default function CouponEditPeriod({
  starts_at,
  ends_at,
  id,
}: {
  starts_at: string | null
  ends_at: string | null
  id: number
}) {
  const setId = useSetAtom(articleButtonAtom)
  const close = React.useCallback(() => setId(''), [setId])

  return (
    <div className="relative flex size-full flex-col gap-1 rounded bg-white">
      <h3 className="absolute top-0 left-0 flex items-center gap-3 rounded-br border-r border-b border-gray-300 bg-gray-300 px-2 py-0.5 text-xs">
        <p className="flex items-center gap-3">
          쿠폰 유효 기간 변경 <MoveRight size={14} />{' '}
        </p>
        <p className="text-sm font-bold text-red-500">
          기존 기간( {formatPeriod(starts_at, ends_at)} )
        </p>
      </h3>

      <ServerForm<FormState<CouponUpdateFormValues>>
        action={updatePeriodAction.bind(null, id)}
        className="size-full p-3"
        initialState={initialCouponState({
          starts_at,
          ends_at,
        })}
      >
        {({ state, isPending }) => (
          <CouponUpdateBody
            starts_at={starts_at}
            ends_at={ends_at}
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
  starts_at,
  ends_at,
  state,
  isPending,
  onClose,
}: {
  starts_at: string | null
  ends_at: string | null
  state: FormState<CouponUpdateFormValues>
  isPending: boolean
  onClose: () => void
}) {
  const closedRef = React.useRef(false)
  const [startsAt, setStartsAt] = React.useState<Date | undefined>(
    starts_at ? new Date(starts_at) : undefined,
  )
  const [endsAt, setEndsAt] = React.useState<Date | undefined>(
    ends_at ? new Date(ends_at) : undefined,
  )
  const [includeTime, setIncludeTime] = React.useState(false)

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
      <div className="my-1">
        <div className="mb-6 flex items-center justify-between">
          <label className="flex w-28 cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeTime}
              onChange={(e) => setIncludeTime(e.target.checked)}
            />
            시간까지 설정
          </label>

          <button
            type="button"
            onClick={() => {
              setStartsAt(undefined)
              setEndsAt(undefined)
              setIncludeTime(false)
            }}
            className="text-xs text-gray-500 underline underline-offset-4 hover:text-gray-700"
          >
            초기화
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label name="coupons.starts_at" label="시작일 선택" />
            <DateTimePickerField
              name="coupons.starts_at"
              value={startsAt}
              onChange={setStartsAt}
              includeTime={includeTime}
              boundary="start"
              placeholder="클릭해주세요."
            />
            {state.fieldErrors?.['coupons.starts_at']?.[0] && (
              <ErrorMessage errorMessage={state.fieldErrors?.['coupons.starts_at']?.[0]} />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label name="coupons.ends_at" label="종료일 선택" />
            <DateTimePickerField
              name="coupons.ends_at"
              value={endsAt}
              onChange={setEndsAt}
              includeTime={includeTime}
              boundary="end"
              placeholder="클릭해주세요."
            />

            {state.fieldErrors?.['coupons.ends_at']?.[0] && (
              <ErrorMessage errorMessage={state.fieldErrors?.['coupons.ends_at']?.[0]} />
            )}
          </div>
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
          {isPending ? '변경 중...' : '변경'}
        </AppButton>
      </div>
    </div>
  )
}
