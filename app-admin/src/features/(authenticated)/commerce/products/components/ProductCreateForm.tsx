'use client'

import React from 'react'
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

const initialProductState: FormState<ProductCreateFormValues> = {
  values: {},
  fieldErrors: {},
  success: false,
}

export default function ProductCreateForm() {
  const router = useRouter()

  return (
    <ServerForm<FormState<ProductCreateFormValues>>
      action={productCreateAction}
      initialState={initialProductState}
    >
      {({ state, isPending }) => (
        <>
          {/* 왼쪽: 상품 정보 */}
          <div className="space-y-5">
            <Article title="상품 정보">
              <div className="space-y-4">
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
                  name="description"
                  placeholder="상품 설명(선택)"
                  defaultValue={state.values.products?.description ?? ''}
                  errorMessage={state.fieldErrors?.['products.description']?.[0]}
                />
              </div>
            </Article>

            <Article title="가격 / 할인">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  label="정가"
                  name="price"
                  required
                  type="number"
                  placeholder="0"
                  defaultValue={state.values.products?.price ?? ''}
                  errorMessage={state.fieldErrors?.['products.price']?.[0]}
                />

                <FormSelect
                  label="할인 타입"
                  className="h-10"
                  name="discount_type"
                  options={Object.entries(DISCOUNT_TYPE_META).map(([value, meta]) => ({
                    value: value as DiscountType,
                    label: meta.label,
                    icon: meta.icon,
                  }))}
                  defaultValue={(state.values.products?.discount_type as DiscountType) ?? 'none'}
                  errorMessage={state.fieldErrors?.['products.discount_type']?.[0]}
                />

                <FormInput
                  label="판매가(가격 할인)"
                  name="sale_price"
                  type="number"
                  placeholder="선택"
                  defaultValue={state.values.products?.sale_price ?? ''}
                  errorMessage={state.fieldErrors?.['products.sale_price']?.[0]}
                />

                <FormInput
                  label="할인율(%)"
                  name="sale_rate"
                  type="number"
                  placeholder="0~100"
                  defaultValue={state.values.products?.sale_rate ?? ''}
                  errorMessage={state.fieldErrors?.['products.sale_rate']?.[0]}
                />
              </div>

              {/* form-level 에러 */}
              {state.fieldErrors?._form?.[0] && (
                <p className="text-sm text-rose-600">{state.fieldErrors._form[0]}</p>
              )}
            </Article>

            <Article title="썸네일" subtitle="상품 리스트에 노출되는 대표 이미지 (1장)">
              <ImageField
                name="images.thumbnail"
                multiple={false}
                required
                errorMessage={state.fieldErrors?.['images.thumbnail']?.[0]}
              />
            </Article>

            <Article title="갤러리 이미지" subtitle="상세 갤러리 슬라이드 등에 사용 (여러 장 가능)">
              <ImageField
                name="images.gallery"
                multiple
                maxFiles={20}
                errorMessage={state.fieldErrors?.['images.gallery']?.[0]}
              />
            </Article>

            <Article title="상세(설명) 이미지" subtitle="상세 페이지 설명 영역에 사용">
              <ImageField
                name="images.description"
                multiple
                maxFiles={10}
                errorMessage={state.fieldErrors?.['images.description']?.[0]}
              />
            </Article>
          </div>

          {/* 오른쪽: 상태/저장 */}
          <aside className="space-y-4 lg:sticky lg:top-28">
            <Article title="노출 설정">
              <div className="grid gap-3">
                <FormSelect
                  label="상태"
                  className="h-10"
                  name="status"
                  options={Object.entries(PRODUCT_STATUS_META).map(([value, meta]) => ({
                    value: value as ProductStatus,
                    label: meta.label,
                    icon: meta.icon,
                  }))}
                  defaultValue={(state.values.products?.status as ProductStatus) ?? 'hidden'}
                  errorMessage={state.fieldErrors.status?.[0]}
                />
              </div>
            </Article>

            <Article title="재고">
              <FormInput
                label="재고"
                required
                name="stock"
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
        </>
      )}
    </ServerForm>
  )
}
