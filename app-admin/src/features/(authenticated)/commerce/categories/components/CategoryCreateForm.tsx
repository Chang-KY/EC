'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ServerForm from '@/components/form/ServerForm'
import Article from '@/components/layout/article/Article'
import FormInput from '@/components/form/FormInput'
import FormSelect from '@/components/form/FormSelect'
import Button from '@/components/ui/Button'
import { Dialog } from '@/components/ui/dialog/Dialog'
import { LoadingDialog } from '@/components/ui/dialog/LoadingDialog'
import type { FormState } from '@/types/FormState'

import type { CategoriesCreateFormValues } from '@/features/(authenticated)/commerce/categories/create/schema'
import { categoryCreateAction } from '@/features/(authenticated)/commerce/categories/create/action'
import Modal from '@/components/modal/Modal'
import { ArrowBigRight, X } from 'lucide-react'
import SearchParentCategory from '@/features/(authenticated)/commerce/categories/components/SearchParentCategory'
import { CATEGORIES_TABLE } from '@/types/db'
import clsx from 'clsx'
import CategorySelectButton from '@/features/(authenticated)/commerce/categories/components/CategorySelectButton'

const initialCategoryState: FormState<CategoriesCreateFormValues> = {
  values: {},
  fieldErrors: {},
  success: false,
}

export default function CategoryCreateForm() {
  return (
    <ServerForm<FormState<CategoriesCreateFormValues>>
      action={categoryCreateAction}
      initialState={initialCategoryState}
    >
      {({ state, isPending }) => <CategoryCreateBody state={state} isPending={isPending} />}
    </ServerForm>
  )
}

function CategoryCreateBody({
  state,
  isPending,
}: {
  state: FormState<CategoriesCreateFormValues>
  isPending: boolean
}) {
  const [isOpen, setIsOpen] = useState<1 | 2 | undefined>(undefined)
  const [selectedFirstCategory, setSelectedFirstCategory] = useState<
    CATEGORIES_TABLE['Row'] | undefined
  >(undefined)
  const [selectedSecondCategory, setSelectedSecondCategory] = useState<
    CATEGORIES_TABLE['Row'] | undefined
  >(undefined)
  const parentId = selectedSecondCategory?.id ?? selectedFirstCategory?.id ?? null
  const [previewName, setPreviewName] = useState(state.values.name ?? '')
  const router = useRouter()

  const selectableOptions = [
    { value: 'true', label: '가능' },
    { value: 'false', label: '불가' },
  ]

  return (
    <>
      {/* 왼쪽: 기본 정보 */}
      <div className="mb-5 space-y-5">
        <Article title="카테고리 기본 정보">
          <div className="space-y-3">
            <FormInput
              label="카테고리명"
              name="name"
              required
              placeholder="예: 상의"
              maxLength={20}
              defaultValue={state.values.name ?? ''}
              errorMessage={state.fieldErrors?.['name']?.[0]}
              onChange={(e) => setPreviewName(e.target.value)}
              information={`${previewName.length} / 20`}
            />
            <FormInput
              label="슬러그"
              name="slug"
              required
              placeholder="예: tops"
              defaultValue={state.values.slug ?? ''}
              errorMessage={state.fieldErrors?.['slug']?.[0]}
            />
          </div>
        </Article>

        <Article title="분류 체계 설정" subtitle="카테고리의 위치(계층)를 단계별로 설정합니다.">
          <input type="hidden" name="parent_id" value={parentId ? String(parentId) : ''} />

          <div className="flex items-center justify-between gap-3">
            <CategorySelectButton
              deleteCategory={
                selectedFirstCategory ? () => setSelectedFirstCategory(undefined) : undefined
              }
              type={1}
              openCategoryModal={() => setIsOpen(1)}
              description={selectedFirstCategory ? selectedFirstCategory.name : previewName}
              isSelected={!!selectedFirstCategory}
              isSelectedSecond={!!selectedSecondCategory}
            />

            {selectedFirstCategory ? (
              <>
                <ArrowBigRight size={28} />
                <CategorySelectButton
                  deleteCategory={
                    selectedSecondCategory ? () => setSelectedSecondCategory(undefined) : undefined
                  }
                  isSelected={!!selectedSecondCategory}
                  type={2}
                  openCategoryModal={() => setIsOpen(2)}
                  description={selectedSecondCategory ? selectedSecondCategory.name : previewName}
                />
              </>
            ) : (
              <>
                <ArrowBigRight size={28} className="opacity-0" />
                <div className="flex h-44 w-1/4 flex-col items-center rounded border opacity-0"></div>
              </>
            )}

            {selectedSecondCategory ? (
              <>
                <ArrowBigRight size={28} />
                <CategorySelectButton type={3} description={previewName} />
              </>
            ) : (
              <>
                <ArrowBigRight size={28} className="opacity-0" />
                <div className="flex h-44 w-1/4 flex-col items-center rounded border opacity-0"></div>
              </>
            )}
          </div>
        </Article>
      </div>

      {/* 오른쪽: 설정 */}
      <aside className="space-y-5 lg:sticky lg:top-28">
        <Article title="구조 설정">
          <FormSelect
            label="상품 연결 가능"
            className="h-10"
            name="selectable"
            options={selectableOptions}
            defaultValue={String(state.values.selectable ?? true)}
            errorMessage={state.fieldErrors?.['selectable']?.[0]}
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
              {isPending ? '생성 중…' : '카테고리 생성'}
            </Button>
          </div>
        </Article>
      </aside>

      <Modal
        isOpen={isOpen === 1 || isOpen === 2}
        onClose={() => setIsOpen(undefined)}
        closeOnEsc
        closeOnOutsideClick
        headerTitle={`${isOpen === 1 ? '1 계층' : '2 계층'}  카테고리 선택`}
        subHeaderTitle="클릭하면 선택됩니다. 아래에서 “선택 완료”를 누르세요."
      >
        <SearchParentCategory
          onClose={() => setIsOpen(undefined)}
          depth={isOpen as 1 | 2}
          parentId={isOpen === 2 ? (selectedFirstCategory?.id ?? null) : null}
          onSelect={(category) => {
            if (isOpen === 1) {
              setSelectedFirstCategory(category)
            } else if (isOpen === 2) {
              setSelectedSecondCategory(category)
            }
          }}
          name={isOpen === 2 ? selectedFirstCategory?.name : undefined}
        />
      </Modal>

      <Dialog
        title="에러가 발생했습니다."
        subTitle={state.fieldErrors?._form?.[0] ?? ''}
        autoOpenKey={state.fieldErrors?._form?.[0]}
      />

      <LoadingDialog
        title="알림"
        subTitle="현재 카테고리를 생성 중 입니다."
        autoOpenKey={isPending}
      />
    </>
  )
}
