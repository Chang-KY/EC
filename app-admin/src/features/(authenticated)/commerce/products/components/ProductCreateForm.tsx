'use client'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import ServerForm from '@/components/form/ServerForm'
import Article from '@/components/layout/article/Article'
import FormInput from '@/components/form/FormInput'
import FormSelect from '@/components/form/FormSelect'
import Button from '@/components/ui/Button'
import type { FormState } from '@/types/FormState'
import {
  DISCOUNT_TYPE_META,
  PRODUCT_STATUS_META,
  ProductCreateFormValues,
} from '@/features/(authenticated)/commerce/products/create/schema'
import {
  DiscountType,
  ProductStatus,
} from '@/features/(authenticated)/commerce/products/productsSchema'
import { productCreateAction } from '@/features/(authenticated)/commerce/products/create/action'
import ImageField from '@/components/ui/ImageField'
import { Dialog } from '@/components/ui/dialog/Dialog'
import { LoadingDialog } from '@/components/ui/dialog/LoadingDialog'

const initialProductState: FormState<ProductCreateFormValues> = {
  values: {},
  fieldErrors: {},
  success: false,
}

export default function ProductCreateForm() {
  const [thumbnailItems, setThumbnailItems] = useState<PreviewItem[]>([])
  const [galleryItems, setGalleryItems] = useState<PreviewItem[]>([])
  const [descriptionItems, setDescriptionItems] = useState<PreviewItem[]>([])

  const action = useCallback(
    async (prev: FormState<ProductCreateFormValues>, fd: FormData) => {
      fd.delete('images.thumbnail')
      fd.delete('images.gallery')
      fd.delete('images.description')

      if (thumbnailItems[0]) fd.set('images.thumbnail', thumbnailItems[0].file)
      for (const it of galleryItems) fd.append('images.gallery', it.file)
      for (const it of descriptionItems) fd.append('images.description', it.file)

      return productCreateAction(prev, fd)
    },
    [thumbnailItems, galleryItems, descriptionItems],
  )

  return (
    <ServerForm<FormState<ProductCreateFormValues>>
      action={action}
      initialState={initialProductState}
    >
      {({ state, isPending }) => (
        <ProductCreateBody
          state={state}
          isPending={isPending}
          thumbnailItems={thumbnailItems}
          setThumbnailItems={setThumbnailItems}
          galleryItems={galleryItems}
          setGalleryItems={setGalleryItems}
          descriptionItems={descriptionItems}
          setDescriptionItems={setDescriptionItems}
        />
      )}
    </ServerForm>
  )
}

function ProductCreateBody({
  state,
  isPending,
  thumbnailItems,
  setThumbnailItems,
  galleryItems,
  setGalleryItems,
  descriptionItems,
  setDescriptionItems,
}: {
  state: FormState<ProductCreateFormValues>
  isPending: boolean
  thumbnailItems: PreviewItem[]
  setThumbnailItems: React.Dispatch<React.SetStateAction<PreviewItem[]>>
  galleryItems: PreviewItem[]
  setGalleryItems: React.Dispatch<React.SetStateAction<PreviewItem[]>>
  descriptionItems: PreviewItem[]
  setDescriptionItems: React.Dispatch<React.SetStateAction<PreviewItem[]>>
}) {
  const router = useRouter()
  const [discountType, setDiscountType] = React.useState<DiscountType>(
    (state.values.products?.discount_type as DiscountType) ?? 'none',
  )

  React.useEffect(() => {
    const next = (state.values.products?.discount_type as DiscountType) ?? 'none'
    setDiscountType(next)
  }, [state.values.products?.discount_type])

  React.useEffect(() => {
    if (state.success) {
      setThumbnailItems([])
      setGalleryItems([])
      setDescriptionItems([])
    }
  }, [state.success, setThumbnailItems, setGalleryItems, setDescriptionItems])

  const discountLabel = DISCOUNT_TYPE_META[discountType]?.label ?? '할인 없음'

  const showSalePrice = discountType === 'fixed'
  const showSaleRate = discountType === 'rate'

  return (
    <>
      <div className="mb-5 space-y-5">
        <Article title="상품 정보">
          <div className="space-y-3">
            <FormInput
              label="상품명"
              name="products.name"
              required
              placeholder="예: 나이키 에어포스 1"
              defaultValue={state.values.products?.name ?? ''}
              errorMessage={state.fieldErrors?.['products.name']?.[0]}
            />

            <FormInput
              label="설명"
              name="products.description"
              placeholder="상품 설명(선택)"
              defaultValue={state.values.products?.description ?? ''}
              errorMessage={state.fieldErrors?.['products.description']?.[0]}
            />
          </div>
        </Article>

        <Article title="가격 / 할인" subtitle={`${discountLabel}이(가) 선택되었습니다.`}>
          <div className="grid gap-3 md:grid-cols-2">
            <FormInput
              label="정가"
              name="products.price"
              required
              type="number"
              placeholder="0"
              defaultValue={state.values.products?.price ?? ''}
              errorMessage={state.fieldErrors?.['products.price']?.[0]}
            />

            <FormSelect
              label="할인 타입"
              className="h-10"
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
          </div>
          {showSalePrice && (
            <FormInput
              label="할인가 ( 원 )"
              name="products.sale_price"
              required
              type="number"
              placeholder="선택"
              defaultValue={state.values.products?.sale_price ?? ''}
              errorMessage={state.fieldErrors?.['products.sale_price']?.[0]}
            />
          )}

          {showSaleRate && (
            <FormInput
              label="할인율 ( % )"
              name="products.sale_rate"
              required
              type="number"
              placeholder="0~100"
              defaultValue={state.values.products?.sale_rate ?? ''}
              errorMessage={state.fieldErrors?.['products.sale_rate']?.[0]}
            />
          )}
        </Article>

        <Article title="썸네일" subtitle="상품 리스트에 노출되는 대표 이미지 (1장)">
          <ImageField
            name="images.thumbnail"
            multiple={false}
            value={thumbnailItems}
            onValueChange={setThumbnailItems}
            errorMessage={state.fieldErrors?.['images.thumbnail']?.[0]}
          />
        </Article>

        <Article title="갤러리 이미지" subtitle="상세 갤러리 슬라이드 등에 사용 (여러 장 가능)">
          <ImageField
            name="images.gallery"
            multiple
            maxFiles={20}
            value={galleryItems}
            onValueChange={setGalleryItems}
            errorMessage={state.fieldErrors?.['images.gallery']?.[0]}
          />
        </Article>

        <Article title="상세(설명) 이미지" subtitle="상세 페이지 설명 영역에 사용">
          <ImageField
            name="images.description"
            multiple
            maxFiles={10}
            value={descriptionItems}
            onValueChange={setDescriptionItems}
            errorMessage={state.fieldErrors?.['images.description']?.[0]}
          />
        </Article>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-28">
        <Article title="노출 설정">
          <FormSelect
            label="상태"
            required
            className="h-10"
            name="products.status"
            options={Object.entries(PRODUCT_STATUS_META).map(([value, meta]) => ({
              value: value as ProductStatus,
              label: meta.label,
              icon: meta.icon,
            }))}
            defaultValue={(state.values.products?.status as ProductStatus) ?? 'hidden'}
            errorMessage={state.fieldErrors.status?.[0]}
          />
        </Article>

        <Article title="재고">
          <FormInput
            label="재고"
            required
            name="products.stock"
            type="number"
            placeholder="선택"
            defaultValue={state.values.products?.stock ?? ''}
            errorMessage={state.fieldErrors?.['products.stock']?.[0]}
          />
        </Article>

        <Article>
          <div className="flex items-center justify-end gap-2.5">
            <Button
              variant="cancel"
              type="button"
              onClick={() => router.back()}
              disabled={isPending}
            >
              취소
            </Button>
            <Button variant="add" type="submit" disabled={isPending}>
              {isPending ? '생성 중…' : '상품 생성'}
            </Button>
          </div>
        </Article>
      </aside>

      <Dialog
        title="에러가 발생했습니다."
        subTitle={state.fieldErrors?._form?.[0] ?? ''}
        autoOpenKey={state.fieldErrors?._form?.[0]}
      />
      <LoadingDialog title="알림" subTitle="현재 상품을 생성 중 입니다." autoOpenKey={isPending} />
    </>
  )
}
