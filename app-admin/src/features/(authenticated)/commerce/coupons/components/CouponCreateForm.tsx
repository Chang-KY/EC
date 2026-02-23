'use client'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import ServerForm from '@/components/form/ServerForm'
import Article from '@/components/layout/article/Article'
import FormInput from '@/components/form/FormInput'
import FormSelect from '@/components/form/FormSelect'
import AppButton from '@/components/ui/AppButton'
import type { FormState } from '@/types/FormState'
import { Dialog } from '@/components/ui/dialog/Dialog'
import { LoadingDialog } from '@/components/ui/dialog/LoadingDialog'
import { CouponCreateFormValues } from '@/features/(authenticated)/commerce/coupons/create/createSchema'
import { couponCreateAction } from '@/features/(authenticated)/commerce/coupons/create/createAction'
import { DISCOUNT_TYPE_META, DiscountType } from '@/schema/DiscountTypeMeta'
import {
  COUPON_KIND_META,
  CouponKind,
} from '@/features/(authenticated)/commerce/coupons/couponsSchema'
import {
  APPLY_MODE_META,
  ApplyMode,
} from '@/features/(authenticated)/commerce/coupons/applyModeSchema'
import { CalendarClock, Dices } from 'lucide-react'
import { generateCouponCode } from '@/features/(authenticated)/commerce/coupons/utils/generateCouponCode'
import clsx from 'clsx'
import { DatePickerWithRange } from '@/components/ui/date-picker/DatePickerWithRange'

const initialCouponState: FormState<CouponCreateFormValues> = {
  values: {},
  fieldErrors: {},
  success: false,
}

export default function CouponCreateForm() {
  const action = useCallback(async (prev: FormState<CouponCreateFormValues>, fd: FormData) => {
    return couponCreateAction(prev, fd)
  }, [])

  return (
    <ServerForm<FormState<CouponCreateFormValues>>
      action={action}
      initialState={initialCouponState}
    >
      {({ state, isPending }) => <CouponCreateBody state={state} isPending={isPending} />}
    </ServerForm>
  )
}

function CouponCreateBody({
  state,
  isPending,
}: {
  state: FormState<CouponCreateFormValues>
  isPending: boolean
}) {
  const router = useRouter()
  const [couponCode, setCouponCode] = React.useState(state.values.coupons?.coupon_code ?? '')
  const [discountType, setDiscountType] = React.useState<DiscountType>(
    (state.values.coupons?.discount_type as DiscountType) ?? 'rate',
  )
  const [couponType, setCouponType] = useState<CouponKind>(
    (state.values.coupons?.coupon_kind as CouponKind) ?? 'general',
  )
  const discountLabel = DISCOUNT_TYPE_META[discountType]?.label ?? '할인 없음'

  const handleGenerateCode = () => {
    const code = generateCouponCode(16)
    setCouponCode(code)
  }

  return (
    <>
      <div className="mb-5 space-y-5">
        <Article title="쿠폰 정보">
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <FormInput
                label="쿠폰명"
                name="coupons.name"
                required
                placeholder="예: 1주년 기념 쿠폰"
                defaultValue={state.values.coupons?.name ?? ''}
                errorMessage={state.fieldErrors?.['coupons.name']?.[0]}
              />

              <FormInput
                label="설명"
                name="coupons.description"
                placeholder="쿠폰 설명"
                defaultValue={state.values.coupons?.description ?? ''}
                errorMessage={state.fieldErrors?.['coupons.description']?.[0]}
              />
            </div>
            <div className={clsx(couponType === 'general' ? '' : 'grid gap-3 md:grid-cols-2')}>
              <FormSelect
                label="쿠폰 종류"
                required
                className="h-10"
                name="coupons.coupon_kind"
                options={Object.entries(COUPON_KIND_META).map(([value, meta]) => ({
                  value: value as CouponKind,
                  label: meta.label,
                  icon: meta.icon,
                }))}
                defaultValue={couponType}
                onChange={(e) => setCouponType(e.target.value as CouponKind)}
                errorMessage={state.fieldErrors?.['coupons.coupon_kind']?.[0]}
              />
              {couponType !== 'general' && (
                <div className="relative">
                  <FormInput
                    label="쿠폰 코드"
                    name="coupons.coupon_code"
                    placeholder="예: ANNIV2026 (중복 불가)"
                    maxLength={17}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    errorMessage={state.fieldErrors?.['coupons.coupon_code']?.[0]}
                    icon={
                      <Dices
                        onClick={handleGenerateCode}
                        className="size-6.5 cursor-pointer rounded-full bg-indigo-500/20 p-1 opacity-100 hover:opacity-80"
                      />
                    }
                  />
                  <span className="absolute right-11.5 bottom-1 text-[10px]">
                    {couponCode.length} / 17
                  </span>
                </div>
              )}
            </div>
            <FormInput
              label="메모"
              name="coupons.notes"
              placeholder="내부 관리용 메모"
              defaultValue={state.values.coupons?.notes ?? ''}
              errorMessage={state.fieldErrors?.['coupons.notes']?.[0]}
            />
          </div>
        </Article>

        <Article title="할인" subtitle={`할인 타입 - [ ${discountLabel} ]이(가) 선택되었습니다.`}>
          <div
            className={clsx(
              'grid gap-3',
              discountType === 'rate' ? 'md:grid-cols-3' : 'md:grid-cols-2',
            )}
          >
            <FormSelect
              label="할인 타입"
              required
              className="h-10"
              name="coupons.discount_type"
              options={Object.entries(DISCOUNT_TYPE_META)
                .filter(([value]) => value !== 'none')
                .map(([value, meta]) => ({
                  value: value as DiscountType,
                  label: meta.label,
                  icon: meta.icon,
                }))}
              defaultValue={discountType}
              onChange={(e) => setDiscountType(e.target.value as DiscountType)}
              errorMessage={state.fieldErrors?.['coupons.discount_type']?.[0]}
            />

            <FormInput
              label={`할인${discountType === 'rate' ? '률 ( % )' : '가 ( ₩ )'}`}
              name="coupons.discount_value"
              required
              type="number"
              placeholder="0"
              defaultValue={state.values.coupons?.discount_value ?? ''}
              errorMessage={state.fieldErrors?.['coupons.discount_value']?.[0]}
            />

            {discountType === 'rate' && (
              <FormInput
                label="최대 할인 금액 (₩)"
                name="coupons.max_discount"
                type="number"
                placeholder="5,000"
                defaultValue={state.values.coupons?.max_discount ?? ''}
                errorMessage={state.fieldErrors?.['coupons.max_discount']?.[0]}
              />
            )}
          </div>
        </Article>

        <Article title="유효 기간" subtitle="선택하지 않으면 무기한으로 처리돼요.">
          <DatePickerWithRange
            required
            name="coupons.expiration_date"
            // defaultValue={state.values.coupons?.expiration_date ?? ''}
            errorMessage={state.fieldErrors?.['coupons.expiration_date']?.[0]}
            label="시작 일시 ~ 종료 일시"
          />
        </Article>

        <Article title="적용 범위">
          <div className="grid gap-3 md:grid-cols-2">
            <FormSelect
              label="상품 적용 모드"
              required
              className="h-10"
              name="coupons.product_mode"
              options={Object.entries(APPLY_MODE_META).map(([value, meta]) => ({
                value: value as ApplyMode,
                label: meta.label,
                icon: meta.icon,
              }))}
              defaultValue={(state.values.coupons?.product_mode as ApplyMode) ?? 'all'}
              errorMessage={state.fieldErrors?.['coupons.product_mode']?.[0]}
            />

            <FormSelect
              label="카테고리 적용 모드"
              className="h-10"
              name="coupons.category_mode"
              options={Object.entries(APPLY_MODE_META).map(([value, meta]) => ({
                value: value as ApplyMode,
                label: meta.label,
                icon: meta.icon,
              }))}
              defaultValue={(state.values.coupons?.category_mode as ApplyMode) ?? 'all'}
              errorMessage={state.fieldErrors?.['coupons.category_mode']?.[0]}
            />
          </div>
        </Article>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-28">
        <Article title="운영 설정">
          <FormSelect
            label="활성화"
            required
            className="h-10"
            name="coupons.is_active"
            options={[
              { value: 'true', label: '활성' },
              { value: 'false', label: '비활성' },
            ]}
            defaultValue={(state.values.coupons?.is_active ?? true) ? 'true' : 'false'}
            errorMessage={state.fieldErrors?.['coupons.is_active']?.[0]}
          />
        </Article>
        <Article title="사용 조건">
          <div className="grid gap-3 md:grid-cols-2">
            <FormInput
              label="최소 주문 금액 (₩)"
              name="coupons.min_order_amount"
              type="number"
              placeholder="10,000"
              defaultValue={state.values.coupons?.min_order_amount ?? ''}
              errorMessage={state.fieldErrors?.['coupons.min_order_amount']?.[0]}
            />

            <FormInput
              label="1인당 최대 사용 횟수"
              name="coupons.max_per_user"
              required
              type="number"
              placeholder="1"
              defaultValue={state.values.coupons?.max_per_user ?? 1}
              errorMessage={state.fieldErrors?.['coupons.max_per_user']?.[0]}
            />

            <FormInput
              label="총 발급 수량"
              name="coupons.max_issue"
              type="number"
              placeholder="500"
              defaultValue={state.values.coupons?.max_issue ?? ''}
              errorMessage={state.fieldErrors?.['coupons.max_issue']?.[0]}
            />

            <FormInput
              label="총 사용 가능 횟수"
              name="coupons.max_redemptions"
              type="number"
              placeholder="5"
              defaultValue={state.values.coupons?.max_redemptions ?? ''}
              errorMessage={state.fieldErrors?.['coupons.max_redemptions']?.[0]}
            />
          </div>

          <FormSelect
            label="중복 적용"
            required
            className="h-10"
            name="coupons.stackable"
            options={[
              { value: 'false', label: '불가' },
              { value: 'true', label: '가능' },
            ]}
            defaultValue={(state.values.coupons?.stackable ?? false) ? 'true' : 'false'}
            errorMessage={state.fieldErrors?.['coupons.stackable']?.[0]}
          />
        </Article>

        <Article>
          <div className="flex items-center justify-end gap-2.5">
            <AppButton
              variant="cancel"
              type="button"
              onClick={() => router.back()}
              disabled={isPending}
            >
              취소
            </AppButton>
            <AppButton variant="add" type="submit" disabled={isPending}>
              {isPending ? '생성 중…' : '쿠폰 생성'}
            </AppButton>
          </div>
        </Article>
      </aside>

      <Dialog
        title="에러가 발생했습니다."
        subTitle={state.fieldErrors?._form?.[0] ?? ''}
        autoOpenKey={state.fieldErrors?._form?.[0]}
      />
      <LoadingDialog title="알림" subTitle="현재 쿠폰을 생성 중 입니다." autoOpenKey={isPending} />
    </>
  )
}
