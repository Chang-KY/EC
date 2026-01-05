import React from 'react'
import { fetchRowByColumn } from '@/lib/db/fetchRowById'
import { Metadata } from 'next'
import { getProductDetail } from '@/features/(authenticated)/commerce/products/detail/getProducts'
import Section from '@/components/layout/Section'
import Article from '@/components/layout/article/Article'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'
import Button from '@/components/ui/Button'
import {
  DISCOUNT_TYPE_META,
  PRODUCT_STATUS_META,
} from '@/features/(authenticated)/commerce/products/productsSchema'
import { DiscountType, ProductStatus } from '@/types/enum'
import InfoRow from '@/components/ui/InfoRow'
import Image from 'next/image'
import { getFileFullPath } from '@/utils/getFileFullPath'
import { isLocalSupabase } from '@/lib/env'
import InfoRowInputUpdate from '@/components/ui/InfoRowInputUpdate'
import {
  productUpdateDescriptionAction,
  productUpdateNameAction,
  productUpdatePriceAction,
  productUpdateSalePriceAction,
  productUpdateSaleRateAction,
  productUpdateStatusAction,
  productUpdateStockAction,
} from '@/features/(authenticated)/commerce/products/update/basicInfoActions'
import MetaChip from '@/components/ui/MetaChip'
import InfoRowSelectUpdate from '@/components/ui/InfoRowSelectUpdate'
import ArticleButton from '@/components/layout/article/ArticleButton'
import ProductEditPriceForm from '@/features/(authenticated)/commerce/products/components/ProductEditPriceForm'
import { getDiscountEffectText } from '@/features/(authenticated)/commerce/products/getDiscountEffectText'
import ProductLikeUserConfirm from '@/features/(authenticated)/commerce/products/components/ProductLikeUserConfirm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const numericId = Number(id)

  const meta = await fetchRowByColumn('products', 'id', numericId, ['name', 'description'] as const)

  if (!meta) {
    return {
      title: '상품을 찾을 수 없음 | 상품 상세 | Admin',
      description: '요청하신 상품 정보를 찾을 수 없습니다.',
    }
  }

  return {
    title: `${meta.name} | 상품 상세 | Admin`,
    description: meta.description ?? `${meta.name} 상품의 상세 정보를 확인하는 페이지입니다.`,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const numericId = Number(id)

  const p = await getProductDetail(Number(numericId))

  if (!p) {
    return (
      <Section pathTitle="not-found">
        <Article title="상품 상세">
          <p className="text-sm text-gray-500">존재하지 않는 상품입니다.</p>
          <div className="flex items-center justify-end">
            <Link href={ROUTES.PRODUCTS}>
              <Button type="button" variant="cancel">
                돌아가기
              </Button>
            </Link>
          </div>
        </Article>
      </Section>
    )
  }

  const productStatusKey = p.product.status as ProductStatus
  const discountTypeKey = p.product.discount_type as DiscountType

  const statusMeta = PRODUCT_STATUS_META[productStatusKey]
  const discountMeta = DISCOUNT_TYPE_META[discountTypeKey]

  const statusLabel = statusMeta.label
  const discountLabel = discountMeta.label

  const product = p.product
  const images = p.images
  const like_count = p.like_count

  const galleryCount = images?.filter((i) => i.role === 'gallery').length ?? 0
  const descriptionCount = images?.filter((i) => i.role === 'description').length ?? 0

  return (
    <Section pathTitle={`${ROUTES.PRODUCTS}/${id}`}>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="mb-5 space-y-5">
          {/* 상품 정보 */}
          <Article title="상품 정보" subtitle="상품 기본 정보">
            <div className="space-y-3">
              <InfoRow label="상품 ID" value={product.id ?? '-'} />
              <InfoRow
                label="상품명"
                value={product.name ?? '-'}
                action={
                  <InfoRowInputUpdate<number>
                    targetId="basic-info-name"
                    id={numericId}
                    initialValue={product.name ?? ''}
                    field="name"
                    action={productUpdateNameAction}
                  />
                }
              />
              <InfoRow
                label="설명"
                value={product.description ?? '-'}
                action={
                  <InfoRowInputUpdate<number>
                    targetId="basic-info-description"
                    id={numericId}
                    initialValue={product.description ?? ''}
                    field="description"
                    action={productUpdateDescriptionAction}
                  />
                }
              />
            </div>
          </Article>

          {/* 가격 / 할인 */}
          <Article
            title="가격 / 할인"
            subtitle="가격 및 할인 정책"
            id="product-price"
            menu={[
              {
                id: 'product-price-edit',
                element: <ArticleButton targetId="product-price-edit" label="할인 가격 수정" />,
                boardContent: (
                  <ProductEditPriceForm
                    price={product.price}
                    sale_price={product.sale_price ?? undefined}
                    sale_rate={product.sale_rate ?? undefined}
                    discount_type={product.discount_type}
                    id={Number(id)}
                  />
                ),
              },
            ]}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <InfoRow
                label="정가"
                value={product.price != null ? `${product.price.toLocaleString()}원` : '-'}
                action={
                  <InfoRowInputUpdate<number>
                    inputTypeNumber={true}
                    targetId="basic-info-price"
                    id={numericId}
                    initialValue={product.price ?? ''}
                    field="price"
                    action={productUpdatePriceAction}
                  />
                }
              />
              <InfoRow
                label="할인 타입"
                value={
                  discountMeta ? (
                    <MetaChip label={discountMeta.label} icon={discountMeta.icon} />
                  ) : (
                    (discountLabel ?? '-')
                  )
                }
              />

              {discountTypeKey === 'fixed' && (
                <>
                  <InfoRow
                    label="할인가"
                    value={
                      product.sale_price != null ? `${product.sale_price.toLocaleString()}원` : '-'
                    }
                  />
                  <InfoRow
                    label="할인 효과"
                    value={getDiscountEffectText({
                      price: product.price,
                      discountTypeKey,
                      sale_price: product.sale_price,
                      sale_rate: product.sale_rate,
                    })}
                  />
                </>
              )}
              {discountTypeKey === 'rate' && (
                <>
                  <InfoRow
                    label="할인율"
                    value={product.sale_rate != null ? `${product.sale_rate}%` : '-'}
                  />
                  <InfoRow
                    label="할인 효과"
                    value={getDiscountEffectText({
                      price: product.price,
                      discountTypeKey,
                      sale_price: product.sale_price,
                      sale_rate: product.sale_rate,
                    })}
                  />
                </>
              )}
            </div>
          </Article>

          {/* 재고 */}
          <Article title="재고" subtitle="판매 가능 수량">
            <InfoRow
              label="재고"
              value={product.stock != null ? product.stock.toLocaleString() : '-'}
              action={
                <InfoRowInputUpdate<number>
                  inputTypeNumber={true}
                  targetId="basic-info-stock"
                  id={numericId}
                  initialValue={product.stock ?? ''}
                  field="stock"
                  action={productUpdateStockAction}
                />
              }
            />
          </Article>

          {/* 이미지 */}
          <Article title="상품 이미지" subtitle="thumbnail / gallery / description">
            <div className="space-y-3">
              <InfoRow label="이미지 개수" value={images?.length ? `${images.length}장` : '0장'} />
              <InfoRow
                label="썸네일"
                value={images?.some((i) => i.role === 'thumbnail') ? '등록됨' : '-'}
              />
              <InfoRow
                label="갤러리"
                value={
                  images?.some((i) => i.role === 'gallery')
                    ? `등록됨 ( ${galleryCount ? `${galleryCount} 장` : ''} )`
                    : '-'
                }
              />
              <InfoRow
                label="상세 이미지"
                value={
                  images?.some((i) => i.role === 'description')
                    ? `등록됨 ( ${descriptionCount ? `${descriptionCount} 장` : ''} )`
                    : '-'
                }
              />
            </div>

            {images?.length ? (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((img) => (
                  <div key={img.id} className="rounded-md border border-gray-200 p-2">
                    <p className="text-xs text-gray-500">
                      {img.role} · #{img.sort_order}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-gray-800">
                      {img.alt ?? '-'}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-500" title={img.storage_path}>
                      {img.storage_path}
                    </p>
                    <Image
                      src={getFileFullPath(img.storage_path)}
                      alt={img.alt ?? '상품 이미지'}
                      width={700}
                      height={700}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized={isLocalSupabase}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </Article>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28">
          {/* 노출/상태 */}
          <Article title="노출 설정" subtitle="상태/정책">
            <InfoRow
              label="상태"
              value={
                statusMeta ? (
                  <MetaChip
                    label={statusMeta.label}
                    icon={statusMeta.icon}
                    menuElement={Object.entries(PRODUCT_STATUS_META).map(([key, meta]) => ({
                      id: key,
                      element: (
                        <InfoRowSelectUpdate<number>
                          id={numericId}
                          field="status"
                          label={meta.label}
                          disabled={productStatusKey === (key as ProductStatus)}
                          value={key}
                          action={productUpdateStatusAction}
                        />
                      ),
                    }))}
                  />
                ) : (
                  (statusLabel ?? '-')
                )
              }
            />
          </Article>

          {/* 활동/통계 */}
          <Article title="활동" subtitle="반응 및 생성 정보">
            <div className="grid grid-cols-1 gap-3">
              <InfoRow
                label="좋아요"
                value={
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-gray-800">
                      {like_count != null ? `${like_count.toLocaleString()}개` : '0개'}
                    </span>

                    <ProductLikeUserConfirm />
                  </div>
                }
              />
              <InfoRow
                label="생성일"
                value={
                  product.created_at ? new Date(product.created_at).toLocaleString('ko-KR') : '-'
                }
              />
            </div>
          </Article>

          {/* 액션 */}
          <Article>
            <div className="flex items-center justify-end gap-2.5">
              <Link href={ROUTES.PRODUCTS}>
                <Button variant="cancel" type="button">
                  목록으로
                </Button>
              </Link>
              <Button variant="delete" type="button">
                상품 삭제
              </Button>
            </div>
          </Article>
        </aside>
      </div>
    </Section>
  )
}
