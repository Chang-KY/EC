'use client'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import ServerForm from '@/components/form/ServerForm'
import Article from '@/components/layout/article/Article'
import FormInput from '@/components/form/FormInput'
import FormSelect from '@/components/form/FormSelect'
import AppButton from '@/components/ui/AppButton'
import type { FormState } from '@/types/FormState'
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
import { ArrowBigDown, Dices, FolderTree, Package, X } from 'lucide-react'
import { generateCouponCode } from '@/features/(authenticated)/commerce/coupons/utils/generateCouponCode'
import clsx from 'clsx'
import Modal from '@/components/modal/Modal'
import SearchCategory from '@/features/(authenticated)/commerce/coupons/components/SearchCategory'
import SearchProduct from '@/features/(authenticated)/commerce/coupons/components/SearchProduct'
import { PRODUCTS_TABLE } from '@/types/db'
import { SelectedProductRow } from '@/features/(authenticated)/commerce/coupons/components/CouponProductsRow'
import { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoryRootForCoupon'
import CouponCategoriesRow from '@/features/(authenticated)/commerce/coupons/components/CouponCategoriesRow'
import { useGetCategoriesForCoupon } from '@/features/(authenticated)/commerce/coupons/hooks/useGetCategoriesForCoupon'
import { uniqueById } from '@/features/(authenticated)/commerce/coupons/utils/uniqueById'
import { getBranchCategories } from '@/features/(authenticated)/commerce/coupons/utils/getBranchCategory'
import { normalizeSelectedCategories } from '@/features/(authenticated)/commerce/coupons/utils/normalizeSelectedCategories'
import DateTimePickerField from '@/components/ui/date-picker/DateTimePickerField'
import Label from '@/components/ui/Label'
import Loading from '@/components/loading/Loading'
import ErrorMessage from '@/components/ui/ErrorMessage'

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

  const [startsAt, setStartsAt] = React.useState<Date | undefined>()
  const [endsAt, setEndsAt] = React.useState<Date | undefined>()
  const [includeTime, setIncludeTime] = React.useState(false)

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
  const { items: allCategories = [] } = useGetCategoriesForCoupon({
    enabled: openModal === 'category',
  })

  const discountLabel = DISCOUNT_TYPE_META[discountType]?.label ?? '할인 없음'

  const handleGenerateCode = () => {
    const code = generateCouponCode(16)
    setCouponCode(code)
  }

  const handleSelectCategory = React.useCallback(
    (category: CategoryListItem) => {
      setAppliesCategoryList((prev) => {
        const selectedIdSet = new Set(prev.map((item) => Number(item.id)))
        const isAlreadySelected = selectedIdSet.has(Number(category.id))

        let next: CategoryListItem[]

        if (isAlreadySelected) {
          // 자기 자신 + 하위 전체 제거
          next = prev.filter(
            (item) =>
              !(
                item.path === category.path ||
                String(item.path).startsWith(`${String(category.path)}.`)
              ),
          )
        } else {
          // 자기 자신 + 하위 전체 추가
          const branch = getBranchCategories(category, allCategories)
          next = uniqueById([...prev, ...branch])
        }

        // 추가/삭제 후 부모 자동 선택/해제 정리
        return normalizeSelectedCategories(next, allCategories)
      })
    },
    [allCategories],
  )

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

  const handleRemoveCategoryBranch = React.useCallback(
    (target: CategoryListItem) => {
      setAppliesCategoryList((prev) => {
        const filtered = prev.filter(
          (item) =>
            !(item.path === target.path || String(item.path).startsWith(`${String(target.path)}.`)),
        )

        return normalizeSelectedCategories(filtered, allCategories)
      })
    },
    [allCategories],
  )

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
      footer: [
        <AppButton key="delete-product" variant="delete" onClick={() => setAppliesProductList([])}>
          모든 상품 제거
        </AppButton>,
        <AppButton key="add-product" variant="add" onClick={() => setOpenModal(undefined)}>
          확인
        </AppButton>,
      ],
    },
    category: {
      title: `${appliesCategory === 'exclude' ? '제외' : '포함'} 카테고리 선택`,
      subTitle: '검색 후 목록에서 선택하고, 선택 항목을 확인한 뒤 저장하세요.',
      body: (
        <SearchCategory
          selectedCategories={appliesCategoryList}
          onSelectCategories={(category) => handleSelectCategory(category)}
        />
      ),
      footer: [
        <AppButton key="delete-product" variant="delete" onClick={() => setAppliesCategoryList([])}>
          모든 카테고리 제거
        </AppButton>,
        <AppButton key="add-product" variant="add" onClick={() => setOpenModal(undefined)}>
          확인
        </AppButton>,
      ],
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

            {discountType === 'fixed' && (
              <FormInput
                label="할인가 ( ₩ )"
                name="coupons.discount_value"
                required
                type="number"
                placeholder="0"
                defaultValue={state.values.coupons?.discount_value ?? ''}
                errorMessage={state.fieldErrors?.['coupons.discount_value']?.[0]}
              />
            )}

            {discountType === 'rate' && (
              <>
                <FormInput
                  label="할인률 ( % )"
                  name="coupons.discount_value"
                  required
                  type="number"
                  placeholder="0"
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={state.values.coupons?.discount_value ?? ''}
                  errorMessage={state.fieldErrors?.['coupons.discount_value']?.[0]}
                />
                <FormInput
                  label="최대 할인 금액 (₩)"
                  name="coupons.max_discount"
                  type="number"
                  placeholder="5,000"
                  defaultValue={state.values.coupons?.max_discount ?? ''}
                  errorMessage={state.fieldErrors?.['coupons.max_discount']?.[0]}
                />
              </>
            )}
          </div>
        </Article>

        <Article title="유효 기간" subtitle="선택하지 않으면 무기한으로 처리돼요.">
          <div className="mb-3 flex items-center justify-between">
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
        </Article>
        <Article title="적용 범위 - [  상품  ]">
          <div className={clsx(appliesProduct === 'all' ? '' : 'grid gap-3 md:grid-cols-2')}>
            <FormSelect
              label={APPLY_MODE_META[appliesProduct].label}
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
              label={APPLY_MODE_META[appliesCategory].label}
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
                      {groupedSelectedCategories.map(
                        ({
                          root,
                          descendants,
                          selectionState,
                          totalDescendantsCount,
                          selectedDescendantsCount,
                        }) => {
                          const isOpen = openSelectedGroups[root.id] ?? true

                          return (
                            <CouponCategoriesRow
                              key={root.id}
                              root={root}
                              descendants={descendants}
                              isOpen={isOpen}
                              selectionState={selectionState}
                              totalDescendantsCount={totalDescendantsCount}
                              selectedDescendantsCount={selectedDescendantsCount}
                              setOpenSelectedGroups={setOpenSelectedGroups}
                              onRemoveBranch={handleRemoveCategoryBranch}
                            />
                          )
                        },
                      )}
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
              {isPending ? '생성 중...' : '쿠폰 생성'}
            </AppButton>
          </div>
        </Article>
      </aside>

      {appliesCategory !== 'all' &&
        appliesCategoryList.map((category) => (
          <input
            key={`category-${category.id}`}
            type="hidden"
            name="targets.category_ids"
            value={String(category.id)}
          />
        ))}

      {appliesProduct !== 'all' &&
        appliesProductList.map((product) => (
          <input
            key={`product-${product.id}`}
            type="hidden"
            name="targets.product_ids"
            value={String(product.id)}
          />
        ))}

      {/* 상품 / 카테고리 찾기 모달 */}
      <Modal
        isOpen={openModal === 'product' || openModal === 'category'}
        onClose={() => setOpenModal(undefined)}
        headerTitle={modalConfig?.title ?? ''}
        subHeaderTitle={modalConfig?.subTitle ?? ''}
        footerButton={modalConfig?.footer}
      >
        {modalConfig?.body}
      </Modal>

      {/* 생성 로딩 모달 */}
      <Modal isOpen={isPending} closeOnEsc={false} custom={true}>
        <div className="rounded bg-white p-14 shadow-md">
          <Loading mention="현재 쿠폰을 생성 중 입니다." />
        </div>
      </Modal>

      {/* 에러 표지 모달 */}
      <Modal
        isOpen={!!state.fieldErrors?._form?.[0]}
        onClose={() => setOpenModal(undefined)}
        headerTitle="에러가 발생했습니다."
        subHeaderTitle={state.fieldErrors?._form?.[0] ?? ''}
      >
        <div></div>
      </Modal>
    </>
  )
}
