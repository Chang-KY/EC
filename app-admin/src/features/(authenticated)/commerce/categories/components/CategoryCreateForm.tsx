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
import { X } from 'lucide-react'
import SearchParentCategory from '@/features/(authenticated)/commerce/categories/components/SearchParentCategory'

type ParentOption = {
  id: number
  name: string
  depth?: number | null
}

const initialCategoryState: FormState<CategoriesCreateFormValues> = {
  values: {},
  fieldErrors: {},
  success: false,
}

function makeIndentLabel(name: string, depth?: number | null) {
  const d = depth ?? 1
  const indent = d > 1 ? '—'.repeat(Math.min(d - 1, 6)) + ' ' : ''
  return `${indent}${name}`
}

export default function CategoryCreateForm({
  parentOptions = [],
}: {
  parentOptions?: ParentOption[]
}) {
  return (
    <ServerForm<FormState<CategoriesCreateFormValues>>
      action={categoryCreateAction}
      initialState={initialCategoryState}
    >
      {({ state, isPending }) => (
        <CategoryCreateBody state={state} isPending={isPending} parentOptions={parentOptions} />
      )}
    </ServerForm>
  )
}

function CategoryCreateBody({
  state,
  isPending,
  parentOptions,
}: {
  state: FormState<CategoriesCreateFormValues>
  isPending: boolean
  parentOptions: ParentOption[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [previewFirstName, setPreviewFirstName] = useState('')
  const [previewSecondName, setPreviewSecondName] = useState('')
  const [previewName, setPreviewName] = useState(state.values.name ?? '')
  const router = useRouter()

  const parentSelectOptions = [
    { value: '', label: '없음(루트 카테고리)' },
    ...parentOptions.map((c) => ({
      value: String(c.id),
      label: makeIndentLabel(c.name, c.depth),
    })),
  ]

  const selectableOptions = [
    { value: 'false', label: '불가' },
    { value: 'true', label: '가능' },
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
              defaultValue={state.values.name ?? ''}
              errorMessage={state.fieldErrors?.['name']?.[0]}
              onChange={(e) => setPreviewName(e.target.value)}
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
          <div className="grid gap-3">
            <CategorySelectButton type="first" openCategoryModal={() => setIsOpen(!isOpen)} />
          </div>
        </Article>

        {previewName && (
          <Article title="미리보기" subtitle="카테고리의 계층을 미리 보여줍니다.">
            <div>
              <span className="rounded-full bg-gray-200/90 px-3.5 py-1.5 text-xs">
                {previewName}
              </span>
            </div>
          </Article>
        )}
      </div>

      {/* 오른쪽: 설정 */}
      <aside className="space-y-5 lg:sticky lg:top-28">
        <Article title="구조 설정">
          <FormSelect
            label="상품 연결 가능(selectable)"
            className="h-10"
            name="selectable"
            options={selectableOptions}
            defaultValue={String(state.values.selectable ?? false)}
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} closeOnEsc closeOnOutsideClick>
        <SearchParentCategory onClose={() => setIsOpen(false)} />
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

function CategorySelectButton({
  type,
  openCategoryModal,
}: {
  type: 'first' | 'second'
  openCategoryModal: () => void
}) {
  const text = type === 'first' ? '1 계층' : '2 계층'
  const text2 = type === 'first' ? '1 계층(루트)' : '2 계층'

  return (
    <button
      type="button"
      onClick={openCategoryModal}
      className="flex h-10 w-full items-center justify-between rounded border border-gray-300 px-3"
    >
      <div className="flex min-w-0 items-center gap-0.5 text-left">
        <span className="text-xs font-bold text-gray-900">{text}</span>
        <span className="mx-1">-</span>
        <span className="truncate text-xs text-gray-500">
          선택 안 하면 이 카테고리는 <span className="font-semibold text-red-500">{text2}</span>
          으로 등록됩니다.
        </span>
      </div>

      <span className="ml-3 shrink-0 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-600 transition group-hover:border-gray-300">
        선택
      </span>
    </button>
  )
}
