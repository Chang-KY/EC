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
  const p = await getProductDetail(Number(id))

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

  const StatusIcon = statusMeta.icon
  const DiscountIcon = discountMeta.icon

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
              <InfoRow label="상품명" value={product.name ?? '-'} />
              <InfoRow label="설명" value={product.description ?? '-'} />
            </div>
          </Article>

          {/* 가격 / 할인 */}
          <Article title="가격 / 할인" subtitle="가격 및 할인 정책">
            <div className="grid gap-3 md:grid-cols-2">
              <InfoRow
                label="정가"
                value={product.price != null ? `${product.price.toLocaleString()}원` : '-'}
              />
              <InfoRow
                label="할인 타입"
                value={
                  <span className="inline-flex items-center gap-2">
                    <DiscountIcon size={14} />
                    <span>{discountMeta.label}</span>
                  </span>
                }
              />

              <InfoRow
                label="할인가"
                value={
                  product.sale_price != null ? `${product.sale_price.toLocaleString()}원` : '-'
                }
              />
              <InfoRow
                label="할인율"
                value={product.sale_rate != null ? `${product.sale_rate}%` : '-'}
              />
            </div>
          </Article>

          {/* 재고 */}
          <Article title="재고" subtitle="판매 가능 수량">
            <InfoRow
              label="재고"
              value={product.stock != null ? product.stock.toLocaleString() : '-'}
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
                <span className="inline-flex items-center gap-2">
                  <StatusIcon size={14} />
                  <span>{statusMeta.label}</span>
                </span>
              }
            />
          </Article>

          {/* 활동/통계 */}
          <Article title="활동" subtitle="반응 및 생성 정보">
            <div className="grid grid-cols-1 gap-3">
              <InfoRow
                label="좋아요"
                value={like_count != null ? `${like_count.toLocaleString()}개` : '0개'}
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
