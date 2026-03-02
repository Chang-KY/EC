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
import {
  ArrowBigDown,
  ChevronDown,
  ChevronRight,
  Dices,
  FolderTree,
  Package,
  X,
} from 'lucide-react'
import { generateCouponCode } from '@/features/(authenticated)/commerce/coupons/utils/generateCouponCode'
import clsx from 'clsx'
import { DatePickerWithRange } from '@/components/ui/date-picker/DatePickerWithRange'
import { dateTimeFormat } from '@/utils/DateTimeFormat'
import Modal from '@/components/modal/Modal'
import SearchCategory from '@/features/(authenticated)/commerce/coupons/components/SearchCategory'
import SearchProduct from '@/features/(authenticated)/commerce/coupons/components/SearchProduct'
import { CATEGORIES_TABLE, PRODUCTS_TABLE } from '@/types/db'
import { SelectedProductRow } from '@/features/(authenticated)/commerce/coupons/components/CouponProductsRow'
import { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoryRootForCoupon'
import CouponCategoriesRow from '@/features/(authenticated)/commerce/coupons/components/CouponCategoriesRow'

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
  const [openModal, setOpenModal] = useState<'product' | 'category' | undefined>(undefined)
  const [appliesCategory, setAppliesCategory] = useState<ApplyMode>(
    state.values.coupons?.category_mode ?? 'all',
  )
  const [appliesCategoryList, setAppliesCategoryList] = useState<CategoryListItem[]>([])
  const [appliesProduct, setAppliesProduct] = useState<ApplyMode>(
    state.values.coupons?.product_mode ?? 'all',
  )
  const [appliesProductList, setAppliesProductList] = useState<PRODUCTS_TABLE['Row'][]>([])
  const [openSelectedGroups, setOpenSelectedGroups] = useState<Record<number, boolean>>({})
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

  const groupedSelectedCategories = React.useMemo(() => {
    const selectedSorted = [...appliesCategoryList].sort((a, b) =>
      String(a.path).localeCompare(String(b.path)),
    )

    const roots = selectedSorted.filter((item) => {
      return !selectedSorted.some(
        (maybeParent) =>
          maybeParent.id !== item.id &&
          String(item.path).startsWith(`${String(maybeParent.path)}.`),
      )
    })

    return roots.map((root) => {
      const selectedDescendants = selectedSorted.filter(
        (item) => item.id !== root.id && String(item.path).startsWith(`${String(root.path)}.`),
      )

      const totalDescendants = allCategories.filter(
        (item) => item.id !== root.id && String(item.path).startsWith(`${String(root.path)}.`),
      )

      const selectionState: 'all' | 'partial' =
        selectedDescendants.length === totalDescendants.length ? 'all' : 'partial'

      return {
        root,
        descendants: selectedDescendants,
        totalDescendantsCount: totalDescendants.length,
        selectedDescendantsCount: selectedDescendants.length,
        selectionState,
      }
    })
  }, [appliesCategoryList, allCategories])

  const modalMap = {
    product: {
      title: `${appliesProduct === 'exclude' ? '제외' : '포함'} 상품 선택`,
      subTitle: '검색 후 목록에서 선택하고, 선택 항목을 확인한 뒤 저장하세요.',
      body: (
        <SearchProduct
          selectedProducts={appliesProductList}
          onSelectProduct={(product) => {
            setAppliesProductList((prev) => {
              const exists = prev.some((item) => item.id === product.id)

              if (exists) {
                return prev.filter((item) => item.id !== product.id)
              }

              return [...prev, product]
            })
          }}
        />
      ),
    },
    category: {
      title: `${appliesCategory === 'exclude' ? '제외' : '포함'} 카테고리 선택`,
      subTitle: '검색 후 목록에서 선택하고, 선택 항목을 확인한 뒤 저장하세요.',
      body: (
        <SearchCategory
          selectedCategories={appliesCategoryList}
          onSelectCategories={(category) => {
            setAppliesCategoryList((prev) => {
              const exists = prev.some((item) => item.id === category.id)

              if (exists) {
                return prev.filter((item) => item.id !== category.id)
              }

              return [...prev, category]
            })
          }}
        />
      ),
    },
  } as const
  const modalConfig = openModal ? modalMap[openModal] : null

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
            name="coupons.expiration_date"
            label="시작 일시 ~ 종료 일시"
            required
            errorMessage={state.fieldErrors?.['coupons.expiration_date']?.[0]}
            serialize={(range) => {
              const from = range.from ? dateTimeFormat(range.from, 'date') : ''
              const to = range.to ? dateTimeFormat(range.to, 'date') : ''
              if (!from) return ''
              return to ? `${from} ~ ${to}` : `${from} ~`
            }}
          />
        </Article>
        <Article title="적용 범위 - [  상품  ]">
          <div className={clsx(appliesProduct === 'all' ? '' : 'grid gap-3 md:grid-cols-2')}>
            <FormSelect
              label={
                appliesProduct === 'all'
                  ? '모든 상품'
                  : appliesProduct === 'exclude'
                    ? '상품 제외 모드'
                    : '상품 적용 모드'
              }
              required
              name="coupons.product_mode"
              options={Object.entries(APPLY_MODE_META).map(([value, meta]) => ({
                value: value as ApplyMode,
                label: meta.label,
                icon: meta.icon,
              }))}
              onChange={(e) => {
                const next = e.currentTarget.value as ApplyMode
                setAppliesProduct(next)
              }}
              defaultValue={appliesProduct}
              errorMessage={state.fieldErrors?.['coupons.product_mode']?.[0]}
            />
            {appliesProduct !== 'all' && (
              <div className="flex h-full w-full items-end">
                <button
                  type="button"
                  className={clsx(
                    'flex h-8.5 w-full items-center justify-center gap-2 rounded border px-2 py-1 text-xs font-medium transition-colors',
                    'bg-indigo-100/30 hover:bg-indigo-100',
                    'focus:ring focus:ring-indigo-300 focus:outline-none',
                  )}
                  onClick={() => setOpenModal('product')}
                >
                  <Package className="h-4 w-4 shrink-0" />
                  <span>상품 선택</span>
                </button>
              </div>
            )}
          </div>
          {appliesProduct !== 'all' && (
            <div className="relative flex w-full flex-col items-center justify-center gap-3">
              <ArrowBigDown className="text-gray-700" />
              <div
                className={clsx(
                  'flex h-full min-h-30 w-full items-center justify-center border',
                  appliesProduct === 'exclude' ? 'border-red-200' : 'border-green-200',
                  'relative overflow-y-auto rounded',
                )}
              >
                <div className="w-full self-start">
                  <div
                    className={clsx(
                      'grid grid-cols-[56px_minmax(0,1fr)_120px_100px_88px] items-center',
                      'gap-2 border-b px-3 py-2 text-[11px] font-medium text-gray-500',
                      '',
                      appliesProduct === 'exclude'
                        ? 'border-red-200 bg-red-50/50'
                        : 'border-green-200 bg-green-50/50',
                      appliesProductList.length > 3 ? 'pr-5.5' : '',
                    )}
                  >
                    <div className="text-center">이미지</div>
                    <div className="text-center">상품 정보</div>
                    <div className="text-center">가격</div>
                    <div className="text-center">재고</div>
                    <div className="text-center">해제</div>
                  </div>

                  {appliesProductList.length === 0 ? (
                    <div className="flex min-h-24 items-center justify-center px-3 py-4">
                      <p className="text-xs text-gray-500">
                        {appliesProduct === 'exclude'
                          ? '제외할 상품을 선택해주세요.'
                          : '적용할 상품을 선택해주세요.'}
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-56 min-h-24 divide-y divide-gray-100 overflow-y-auto">
                      {appliesProductList.map((product) => (
                        <SelectedProductRow
                          key={product.id}
                          product={product}
                          clickButton={
                            <button
                              type="button"
                              onClick={() => {
                                setAppliesProductList((prev) =>
                                  prev.filter((item) => item.id !== product.id),
                                )
                              }}
                              className="inline-flex h-7 items-center justify-center gap-1 rounded border border-gray-300 px-2.5 text-[11px] text-gray-700 hover:bg-gray-50"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Article>

        <Article title="적용 범위 - [  카테고리  ]">
          <div className={clsx(appliesCategory === 'all' ? '' : 'grid gap-3 md:grid-cols-2')}>
            <FormSelect
              label={
                appliesCategory === 'all'
                  ? '모든 카테고리'
                  : appliesCategory === 'exclude'
                    ? '카테고리 제외 모드'
                    : '카테고리 적용 모드'
              }
              name="coupons.category_mode"
              options={Object.entries(APPLY_MODE_META).map(([value, meta]) => ({
                value: value as ApplyMode,
                label: meta.label,
                icon: meta.icon,
              }))}
              onChange={(e) => {
                const next = e.currentTarget.value as ApplyMode
                setAppliesCategory(next)
              }}
              defaultValue={appliesCategory}
              errorMessage={state.fieldErrors?.['coupons.category_mode']?.[0]}
            />
            {appliesCategory !== 'all' && (
              <div className="flex h-full w-full items-end">
                <button
                  type="button"
                  className={clsx(
                    'flex h-8.5 w-full items-center justify-center gap-2 rounded border px-2 py-1 text-xs font-medium transition-colors',
                    'bg-indigo-100/30 hover:bg-indigo-100',
                    'focus:ring focus:ring-indigo-300 focus:outline-none',
                  )}
                  onClick={() => setOpenModal('category')}
                >
                  <FolderTree className="h-4 w-4 shrink-0" />
                  <span>카테고리 선택</span>
                </button>
              </div>
            )}
          </div>
          {appliesCategory !== 'all' && (
            <div className="relative flex w-full flex-col items-center justify-center gap-3">
              <ArrowBigDown className="text-gray-700" />
              <div
                className={clsx(
                  'flex h-full min-h-30 w-full items-center justify-center border',
                  appliesCategory === 'exclude' ? 'border-red-200' : 'border-green-200',
                  'relative overflow-y-auto rounded',
                )}
              >
                <div className="w-full self-start">
                  <div
                    className={clsx(
                      'grid grid-cols-[56px_minmax(0,1fr)_80px_140px_88px] items-center gap-2 border-b px-3 py-2 text-[11px] font-medium text-gray-500',
                      appliesCategory === 'exclude'
                        ? 'border-red-200 bg-red-50/50'
                        : 'border-green-200 bg-green-50/50',
                      appliesCategoryList.length > 4 ? 'pr-5.5' : '',
                    )}
                  >
                    <div />
                    <div>카테고리 정보</div>
                    <div className="text-center">깊이(Depth)</div>
                    <div>경로(Slug)</div>
                    <div className="text-center">해제</div>
                  </div>

                  {appliesCategoryList.length === 0 ? (
                    <div className="flex min-h-24 items-center justify-center px-3 py-4">
                      <p className="text-xs text-gray-500">
                        {appliesCategory === 'exclude'
                          ? '제외할 카테고리를 선택해주세요.'
                          : '적용할 카테고리를 선택해주세요.'}
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-56 min-h-24 divide-y divide-gray-100 overflow-y-auto">
                      {groupedSelectedCategories.map(({ root, descendants }) => {
                        const isOpen = openSelectedGroups[root.id] ?? true

                        return (
                          <CouponCategoriesRow
                            key={root.id}
                            root={root}
                            descendants={descendants}
                            isOpen={isOpen}
                            setOpenSelectedGroups={setOpenSelectedGroups}
                            setAppliesCategoryList={setAppliesCategoryList}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Article>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-28">
        <Article title="운영 설정">
          <FormSelect
            label="활성화"
            required
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

      <Modal
        isOpen={openModal === 'product' || openModal === 'category'}
        onClose={() => setOpenModal(undefined)}
        headerTitle={modalConfig?.title ?? ''}
        subHeaderTitle={modalConfig?.subTitle ?? ''}
      >
        {modalConfig?.body}
      </Modal>

      <Dialog
        title="에러가 발생했습니다."
        subTitle={state.fieldErrors?._form?.[0] ?? ''}
        autoOpenKey={state.fieldErrors?._form?.[0]}
      />
      <LoadingDialog title="알림" subTitle="현재 쿠폰을 생성 중 입니다." autoOpenKey={isPending} />
    </>
  )
}
