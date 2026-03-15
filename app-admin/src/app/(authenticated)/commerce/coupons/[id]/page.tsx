import React from 'react'
import { fetchRowByColumn } from '@/lib/db/fetchRowById'
import { Metadata } from 'next'
import Section from '@/components/layout/Section'
import Article from '@/components/layout/article/Article'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'
import AppButton from '@/components/ui/AppButton'
import { getCouponDetail } from '@/features/(authenticated)/commerce/coupons/detail/getCoupons'
import InfoRow from '@/components/ui/InfoRow'
import { dateTimeFormat } from '@/utils/DateTimeFormat'
import { formatDiscountValue } from '@/utils/discountTypeMeta'
import { cn } from '@/lib/cn'
import { APPLY_MODE_META } from '@/features/(authenticated)/commerce/coupons/applyModeSchema'
import { Dices, Package, Tag } from 'lucide-react'
import { PRODUCT_STATUS_META } from '@/features/(authenticated)/commerce/products/productsSchema'
import { ProductStatus } from '@/types/enum'
import InfoRowInputUpdate from '@/components/ui/InfoRowInputUpdate'
import {
  couponUpdateCouponCodeAction,
  couponUpdateCouponKindAction,
  couponUpdateDescriptionAction,
  couponUpdateIsActiveAction,
  couponUpdateMaxDiscountAction,
  couponUpdateMaxIssueAction,
  couponUpdateMaxPerUserAction,
  couponUpdateMaxRedemptionsAction,
  couponUpdateMinOrderAmountAction,
  couponUpdateNameAction,
  couponUpdateStackableAction,
} from '@/features/(authenticated)/commerce/coupons/update/basicInfoActions'
import MetaChip from '@/components/ui/MetaChip'
import InfoRowSelectUpdate from '@/components/ui/InfoRowSelectUpdate'
import clsx from 'clsx'
import { generateCouponCode } from '@/features/(authenticated)/commerce/coupons/utils/generateCouponCode'
import {
  COUPON_KIND_META,
  CouponKind,
} from '@/features/(authenticated)/commerce/coupons/couponsSchema'
import ArticleButton from '@/components/layout/article/ArticleButton'
import CouponEditDiscountType from '@/features/(authenticated)/commerce/coupons/components/CouponEditDiscountType'
import { FALSE, TRUE } from '@/constants/booleanColor'
import CouponMemoEdit from '@/features/(authenticated)/commerce/coupons/components/CouponMemoEdit'
import CouponCreator from '@/features/(authenticated)/commerce/coupons/components/CouponCreator'
import CouponEditPeriod from '@/features/(authenticated)/commerce/coupons/components/CouponEditPeriod'
import { formatPeriod } from '@/features/(authenticated)/commerce/coupons/utils/formatPeriod'
import DetailNothing from '@/components/layout/DetailNothing'
import CouponChangeAppliesProduct from '@/features/(authenticated)/commerce/coupons/components/CouponChangeAppliesProduct'
import CouponChangeAppliesCategory from '@/features/(authenticated)/commerce/coupons/components/CouponChangeAppliesCategory'
import { getFileFullPath } from '@/utils/getFileFullPath'
import { groupSelectedCategories } from '@/features/(authenticated)/commerce/coupons/utils/groupSelectedCategories'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const numericId = Number(id)

  const meta = await fetchRowByColumn('coupons', 'id', numericId, [
    'name',
    'description',
    'discount_type',
    'discount_value',
  ] as const)
  if (!meta) {
    return {
      title: '쿠폰을 찾을 수 없음 | Admin',
      description: '요청하신 쿠폰 정보를 찾을 수 없습니다.',
    }
  }
  const discountType = meta.discount_type === 'fixed' ? '정액' : '정률'
  return {
    title: `${meta.name} | 쿠폰 상세 | Admin`,
    description:
      meta.description ??
      `${discountType} 타입의 ${meta.discount_value} 할인 해주는 쿠폰 상세 정보를 확인하는 페이지입니다.`,
  }
}

export default async function CouponDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const numericId = Number(id)

  const coupon = await getCouponDetail(numericId)
  console.log(coupon)

  if (!coupon) {
    return (
      <DetailNothing
        title="쿠폰 상세"
        description="존재하지 않는 쿠폰입니다."
        href={ROUTES.COUPONS}
      />
    )
  }

  function compareCategoryPath(a: { path: unknown }, b: { path: unknown }) {
    const aPath = String(a.path ?? '')
    const bPath = String(b.path ?? '')

    const aParts = aPath.split('.').map(Number)
    const bParts = bPath.split('.').map(Number)
    const max = Math.max(aParts.length, bParts.length)

    for (let i = 0; i < max; i++) {
      const av = aParts[i] ?? -1
      const bv = bParts[i] ?? -1
      if (av !== bv) return av - bv
    }

    return 0
  }

  const sortedCategories = [...coupon.applyCategory].sort(compareCategoryPath)

  return (
    <Section pathTitle={`${ROUTES.COUPONS}/${id}`}>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="mb-5 space-y-5">
          <Article title="기본 정보" subtitle="쿠폰의 기본 설정과 식별 정보를 확인할 수 있어요.">
            <div className="grid grid-cols-1 gap-3">
              <div className="grid gap-3 md:grid-cols-2">
                <InfoRow
                  label="쿠폰명"
                  value={coupon.name || '-'}
                  action={
                    <InfoRowInputUpdate<number>
                      targetId="basic-info-name"
                      id={numericId}
                      initialValue={coupon.name ?? '-'}
                      field="name"
                      action={couponUpdateNameAction}
                    />
                  }
                />
                <InfoRow
                  label="설명"
                  value={coupon.description || '-'}
                  action={
                    <InfoRowInputUpdate<number>
                      targetId="basic-info-description"
                      id={numericId}
                      initialValue={coupon.description ?? '-'}
                      field="description"
                      action={couponUpdateDescriptionAction}
                    />
                  }
                />
              </div>

              <InfoRow
                label="쿠폰 종류"
                value={
                  <MetaChip
                    label={coupon.coupon_kind === 'code' ? '코드 쿠폰' : '일반 쿠폰'}
                    menuElement={Object.entries(COUPON_KIND_META).map(([key, meta]) => ({
                      id: key,
                      element: (
                        <InfoRowSelectUpdate<number>
                          id={numericId}
                          field="coupon_kind"
                          label={meta.label}
                          disabled={coupon.coupon_kind === (key as CouponKind)}
                          value={key}
                          action={couponUpdateCouponKindAction}
                        />
                      ),
                    }))}
                  />
                }
              />
              {coupon.coupon_kind === 'code' && (
                <InfoRow
                  label="쿠폰 코드"
                  value={
                    coupon.coupon_code || (
                      <span className="text-xs text-indigo-500">코드를 넣어주세요.</span>
                    )
                  }
                  action={
                    <InfoRowInputUpdate<number>
                      isViewValueLength={true}
                      maxLength={17}
                      targetId="basic-info-coupon-code"
                      id={numericId}
                      initialValue={coupon.coupon_code ?? generateCouponCode(16)}
                      field="coupon_code"
                      action={couponUpdateCouponCodeAction}
                      icon={
                        <Dices className="size-6.5 cursor-pointer rounded-full bg-indigo-500/20 p-1 opacity-100 hover:opacity-80" />
                      }
                    />
                  }
                />
              )}
            </div>
          </Article>

          <Article
            title="할인 정보"
            subtitle="할인 방식과 적용 한도를 확인할 수 있어요."
            id="coupon-discount-type"
            menu={[
              {
                id: 'coupon-discount-type-edit',
                element: (
                  <ArticleButton targetId="coupon-discount-type-edit" label="쿠폰 할인 타입 수정" />
                ),
                boardContent: (
                  <CouponEditDiscountType
                    discount_type={coupon.discount_type}
                    id={numericId}
                    discount_value={coupon.discount_value}
                  />
                ),
              },
            ]}
          >
            <div className="grid grid-cols-1 gap-3">
              <div className="grid gap-3 md:grid-cols-2">
                <InfoRow
                  label="할인 방식"
                  value={
                    <MetaChip
                      label={
                        coupon.discount_type === 'fixed'
                          ? '할인가'
                          : coupon.discount_type === 'rate'
                            ? '할인율'
                            : '할인 없음'
                      }
                    />
                  }
                />
                <InfoRow
                  label={clsx(coupon.discount_type === 'rate' ? '할인율' : '할인값')}
                  value={formatDiscountValue(coupon.discount_type, coupon.discount_value)}
                />
              </div>
              <div
                className={clsx(
                  'grid',
                  coupon.discount_type === 'rate' ? 'gap-3 md:grid-cols-2' : '',
                )}
              >
                {coupon.discount_type === 'rate' && (
                  <InfoRow
                    label="최대 할인 금액"
                    value={formatDiscountValue('fixed', coupon.max_discount)}
                    action={
                      <InfoRowInputUpdate<number>
                        inputTypeNumber={true}
                        targetId="basic-info-max-discount"
                        id={numericId}
                        initialValue={coupon.max_discount ?? '-'}
                        field="max_discount"
                        action={couponUpdateMaxDiscountAction}
                      />
                    }
                  />
                )}
                <InfoRow
                  label="최소 주문 금액"
                  value={formatDiscountValue('fixed', coupon.min_order_amount)}
                  action={
                    <InfoRowInputUpdate<number>
                      inputTypeNumber={true}
                      targetId="basic-info-min-order-amount"
                      id={numericId}
                      initialValue={coupon.min_order_amount ?? '-'}
                      field="min_order_amount"
                      action={couponUpdateMinOrderAmountAction}
                    />
                  }
                />
              </div>
            </div>
          </Article>

          <Article
            title="사용 조건"
            subtitle="사용 기간 및 발급/사용 제한을 확인할 수 있어요."
            id="coupon-period"
            menu={[
              {
                id: 'coupon-period-edit',
                element: (
                  <ArticleButton targetId="coupon-period-edit" label="쿠폰 유효 기간 수정" />
                ),
                boardContent: (
                  <CouponEditPeriod
                    starts_at={coupon.starts_at}
                    id={numericId}
                    ends_at={coupon.ends_at}
                  />
                ),
              },
            ]}
          >
            <div className="grid grid-cols-1 gap-3">
              <InfoRow label="유효 기간" value={formatPeriod(coupon.starts_at, coupon.ends_at)} />

              <div className="grid gap-3 md:grid-cols-2">
                <InfoRow
                  label="중복 사용 가능"
                  value={
                    <MetaChip
                      label={coupon.stackable ? '가능' : '불가'}
                      className={coupon.stackable ? TRUE : FALSE}
                      menuElement={[
                        {
                          id: 'possibility',
                          element: (
                            <InfoRowSelectUpdate<number>
                              id={numericId}
                              field="stackable"
                              label="가능"
                              disabled={coupon.stackable}
                              value={true}
                              action={couponUpdateStackableAction}
                            />
                          ),
                        },
                        {
                          id: 'impossibility',
                          element: (
                            <InfoRowSelectUpdate<number>
                              id={numericId}
                              field="stackable"
                              label="불가"
                              disabled={!coupon.stackable}
                              value={false}
                              action={couponUpdateStackableAction}
                            />
                          ),
                        },
                      ]}
                    />
                  }
                />
                <InfoRow
                  label="최대 발급 수량"
                  value={coupon.max_issue != null ? `${coupon.max_issue.toLocaleString()}개` : '-'}
                  action={
                    <InfoRowInputUpdate<number>
                      inputTypeNumber={true}
                      targetId="basic-info-max-issue"
                      id={numericId}
                      initialValue={coupon.max_issue ?? '-'}
                      field="max_issue"
                      action={couponUpdateMaxIssueAction}
                    />
                  }
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <InfoRow
                  label="최대 사용 횟수"
                  value={
                    coupon.max_redemptions != null
                      ? `${coupon.max_redemptions.toLocaleString()} 회`
                      : '-'
                  }
                  action={
                    <InfoRowInputUpdate<number>
                      inputTypeNumber={true}
                      targetId="basic-info-max-redemptions"
                      id={numericId}
                      initialValue={coupon.max_redemptions ?? '-'}
                      field="max_redemptions"
                      action={couponUpdateMaxRedemptionsAction}
                    />
                  }
                />
                <InfoRow
                  label="회원당 최대 사용 횟수"
                  value={`${coupon.max_per_user}회`}
                  action={
                    <InfoRowInputUpdate<number>
                      inputTypeNumber={true}
                      targetId="basic-info-max-per-user"
                      id={numericId}
                      initialValue={coupon.max_per_user ?? '-'}
                      field="max_per_user"
                      action={couponUpdateMaxPerUserAction}
                    />
                  }
                />
              </div>
            </div>
          </Article>

          <Article title="적용 상품" subtitle="상품 적용 방식과 선택된 상품 목록이에요.">
            <div className="space-y-4">
              <InfoRow
                label="상품 적용 방식"
                value={
                  <div className="flex items-center gap-2">
                    <MetaChip
                      label={APPLY_MODE_META[coupon.product_mode].label}
                      className={clsx(
                        coupon.stackable ? TRUE : FALSE,
                        APPLY_MODE_META[coupon.product_mode].className,
                        coupon.product_mode === 'include'
                          ? 'border border-emerald-200 bg-emerald-50'
                          : '',
                        coupon.product_mode === 'exclude'
                          ? 'border border-rose-200 bg-rose-50'
                          : '',
                        coupon.product_mode === 'all' ? 'border border-zinc-200 bg-zinc-50' : '',
                      )}
                    />
                    <CouponChangeAppliesProduct
                      selectedApply={coupon.product_mode}
                      couponId={numericId}
                      selectedProducts={coupon.applyProduct}
                    />
                  </div>
                }
              />

              {coupon.product_mode !== 'all' && (
                <div className="max-h-[228px] min-h-20 overflow-y-auto rounded-md border border-gray-200">
                  <div className="divide-y divide-gray-100">
                    {coupon.applyProduct.length > 0 ? (
                      coupon.applyProduct.map((product) => {
                        const status = product?.status as ProductStatus
                        const meta = PRODUCT_STATUS_META[status]
                        const Icon = meta.icon

                        return (
                          <div
                            key={product.id}
                            className="grid grid-cols-[44px_minmax(0,1fr)_120px_90px_100px] items-center gap-3 px-3 py-2.5"
                          >
                            <div className="flex justify-center">
                              <div className="flex size-8 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
                                {product.product_images[0]?.storagePath ? (
                                  <img
                                    src={getFileFullPath(product.product_images[0].storagePath)}
                                    alt={product.name}
                                    className="size-full rounded border border-gray-200 object-cover"
                                  />
                                ) : (
                                  <Package className="text-gray-400" />
                                )}
                              </div>
                            </div>

                            <Link
                              href={`/commerce/products/${product.id}`}
                              title={`상품 - ${product.name} 디테일 페이지 이동`}
                              className="w-fit min-w-28 rounded bg-white p-1 px-2 py-1 transition-colors duration-200 hover:bg-indigo-200"
                            >
                              <div>
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {product.name}
                                </p>
                                <p className="truncate text-xs text-gray-500">
                                  {product.description || '-'}
                                </p>
                              </div>
                            </Link>

                            <div className="text-sm text-gray-700">
                              {product.stock === null ? 0 : product.stock?.toLocaleString()}재고
                            </div>

                            <div className="text-sm text-gray-700">
                              {product.price.toLocaleString()}원
                            </div>

                            <span className={`inline-flex items-center gap-2 ${meta.className}`}>
                              <Icon size={12} />
                              <span>{meta.label}</span>
                            </span>
                          </div>
                        )
                      })
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        선택된 상품이 없어요.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Article>

          <Article
            title="적용 카테고리"
            subtitle="카테고리 적용 방식과 선택된 카테고리 목록이에요."
          >
            <div className="space-y-4">
              <InfoRow
                label="카테고리 적용 방식"
                value={
                  <div className="flex items-center gap-2">
                    <MetaChip
                      label={APPLY_MODE_META[coupon.category_mode].label}
                      className={clsx(
                        coupon.stackable ? TRUE : FALSE,
                        APPLY_MODE_META[coupon.category_mode].className,
                        coupon.category_mode === 'include'
                          ? 'border border-emerald-200 bg-emerald-50'
                          : '',
                        coupon.category_mode === 'exclude'
                          ? 'border border-rose-200 bg-rose-50'
                          : '',
                        coupon.category_mode === 'all' ? 'border border-zinc-200 bg-zinc-50' : '',
                      )}
                    />
                    <CouponChangeAppliesCategory
                      selectedApply={coupon.category_mode}
                      couponId={numericId}
                      selectedCategories={coupon.applyCategory}
                    />
                  </div>
                }
              />

              {(coupon.category_mode ?? 'all') !== 'all' && (
                <div className="max-h-[228px] min-h-20 overflow-y-auto rounded-md border border-gray-200">
                  <div className="divide-y divide-gray-100">
                    {sortedCategories.length > 0 ? (
                      sortedCategories.map((category) => {
                        const indent = Math.max((category.depth ?? 1) - 1, 0) * 20

                        return (
                          <div
                            key={category.id}
                            className="grid grid-cols-[44px_minmax(0,1fr)_120px_90px_100px] items-center gap-3 px-3 py-2.5"
                          >
                            <div className="flex justify-center">
                              <div className="flex size-8 items-center justify-center rounded border border-gray-200 bg-gray-50">
                                <Tag className="size-4 text-gray-500" />
                              </div>
                            </div>

                            <div className="min-w-0" style={{ paddingLeft: `${indent}px` }}>
                              <div className="flex items-center gap-2">
                                {(category.depth ?? 1) > 1 && (
                                  <span className="text-gray-300">└</span>
                                )}
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {category.name}
                                </p>
                              </div>
                              <p className="truncate text-xs text-gray-500">{category.slug}</p>
                            </div>

                            <div className="text-xs text-gray-600">
                              {category.depth != null ? `depth ${category.depth}` : '-'}
                            </div>

                            <div>
                              <span
                                className={cn(
                                  'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                                  category.selectable
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'bg-gray-100 text-gray-600',
                                )}
                              >
                                {category.selectable ? '선택 가능' : '선택 불가'}
                              </span>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        선택된 카테고리가 없어요.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Article>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28">
          <Article
            title="상태 및 생성 정보"
            subtitle="쿠폰의 현재 상태와 생성 정보를 확인할 수 있어요."
          >
            <div className="grid grid-cols-1 gap-3">
              <InfoRow
                label="상태"
                value={
                  <MetaChip
                    className={coupon.is_active ? TRUE : FALSE}
                    label={coupon.is_active ? '활성' : '비활성'}
                    menuElement={[
                      {
                        id: 'active',
                        element: (
                          <InfoRowSelectUpdate<number>
                            id={numericId}
                            field="is_active"
                            label="활성"
                            disabled={coupon.is_active}
                            value={true}
                            action={couponUpdateIsActiveAction}
                          />
                        ),
                      },
                      {
                        id: 'inactive',
                        element: (
                          <InfoRowSelectUpdate<number>
                            id={numericId}
                            field="is_active"
                            label="비활성"
                            disabled={!coupon.is_active}
                            value={false}
                            action={couponUpdateIsActiveAction}
                          />
                        ),
                      },
                    ]}
                  />
                }
              />
              <InfoRow
                label="생성일"
                value={coupon.created_at ? dateTimeFormat(coupon.created_at, 'datetime') : '-'}
              />
              <InfoRow
                label="생성자"
                value={
                  <CouponCreator
                    id={coupon.creator?.id ?? ''}
                    created_at={coupon.creator?.created_at ?? ''}
                    email={coupon.creator?.email ?? ''}
                    role={coupon.creator?.role ?? 'manager'}
                    name={coupon.creator?.name ?? null}
                    status={coupon.creator?.status ?? 'active'}
                    avatar_url={coupon.creator?.avatar_url ?? null}
                    last_login={coupon.creator?.last_login ?? null}
                    level={coupon.creator?.level ?? 1}
                    phone={coupon.creator?.phone ?? null}
                  />
                }
              />
              <div className="grid gap-3 md:grid-cols-2">
                <InfoRow
                  label="상품 적용 수"
                  value={`${coupon.applyProduct.length.toLocaleString()}개`}
                />
                <InfoRow
                  label="카테고리 적용 수"
                  value={`${coupon.applyCategory.length.toLocaleString()}개`}
                />
              </div>
            </div>
          </Article>

          <Article title="관리 메모" subtitle="관리용 참고 메모예요.">
            <div className="flex max-h-[226px] min-h-[50px] items-center overflow-y-auto rounded-md border border-gray-200 px-4 py-3 pr-5 text-sm text-gray-700">
              <span className="min-w-0 flex-1 leading-relaxed break-words whitespace-pre-wrap">
                {coupon.notes || '등록된 메모가 없어요.'}
              </span>
              <CouponMemoEdit couponId={numericId} initialNotes={coupon.notes} />
            </div>
          </Article>

          <Article>
            <div className="flex items-center justify-end gap-2.5">
              <Link href={ROUTES.COUPONS}>
                <AppButton variant="cancel" type="button">
                  목록으로
                </AppButton>
              </Link>

              <AppButton variant="delete" type="button">
                쿠폰 삭제
              </AppButton>
            </div>
          </Article>
        </aside>
      </div>
    </Section>
  )
}
