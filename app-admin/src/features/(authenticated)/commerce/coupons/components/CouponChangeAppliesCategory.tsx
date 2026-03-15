'use client'

import React, { useState } from 'react'
import { Bolt } from 'lucide-react'
import { iconButtonClassName } from '@/constants/iconButtonClassName'
import Modal from '@/components/modal/Modal'
import AppButton from '@/components/ui/AppButton'
import { ApplyMode } from '@/types/enum'
import SearchCategory from '@/features/(authenticated)/commerce/coupons/components/SearchCategory'
import { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoryRootForCoupon'
import { APPLY_MODE_META } from '@/features/(authenticated)/commerce/coupons/applyModeSchema'
import Select from '@/components/ui/Select'
import { useUpdateAppliesProduct } from '@/features/(authenticated)/commerce/coupons/hooks/useUpdateAppliesProduct'
import { toast } from 'react-toastify'
import { getBranchCategories } from '@/features/(authenticated)/commerce/coupons/utils/getBranchCategory'
import { uniqueById } from '@/features/(authenticated)/commerce/coupons/utils/uniqueById'
import { normalizeSelectedCategories } from '@/features/(authenticated)/commerce/coupons/utils/normalizeSelectedCategories'
import { useGetCategoriesForCoupon } from '@/features/(authenticated)/commerce/coupons/hooks/useGetCategoriesForCoupon'
import { useUpdateAppliesCategory } from '@/features/(authenticated)/commerce/coupons/hooks/useUpdateAppliesCategory'

type CouponChangeAppliesCategoryProps = {
  selectedCategories: CategoryListItem[]
  selectedApply: ApplyMode
  couponId: number
}

export default function CouponChangeAppliesCategory(props: CouponChangeAppliesCategoryProps) {
  const { selectedApply, selectedCategories, couponId } = props
  const [applyMode, setApplyMode] = useState<ApplyMode>(selectedApply)
  const [isOpen, setIsOpen] = useState(false)
  const [appliesCategoryList, setAppliesCategoryList] = useState<CategoryListItem[]>(
    selectedCategories ?? [],
  )
  const { items: allCategories = [] } = useGetCategoriesForCoupon({
    enabled: isOpen,
  })

  const { mutate, mutateAsync, isPending, isError, error } = useUpdateAppliesCategory()

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

  const handleClick = () => {
    mutate(
      {
        id: couponId,
        category_mode: applyMode,
        category_ids: appliesCategoryList.map((p) => p.id),
      },
      {
        onSuccess: () => {
          setIsOpen(false)
          toast.success('변경 완료', { toastId: 'updateAppliesCategoryList' })
        },
      },
    )
  }

  return (
    <>
      <button className={iconButtonClassName} type="button" onClick={() => setIsOpen(true)}>
        <Bolt size={14} />
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        headerTitle="적용할 카테고리"
        subHeaderTitle="카테고리를 선택 후 적용 버튼을 클릭해주세요."
        footerButton={[
          <AppButton
            key="cancel-applies-category"
            variant="cancel"
            onClick={() => setIsOpen(false)}
          >
            취소
          </AppButton>,
          <AppButton
            key="update-applies-category"
            variant="update"
            disabled={isPending}
            onClick={handleClick}
          >
            적용
          </AppButton>,
        ]}
      >
        <SearchCategory
          mode={applyMode}
          selectedCategories={appliesCategoryList}
          onSelectCategories={(category) => handleSelectCategory(category)}
        >
          <Select
            className="w-full"
            aria-label={APPLY_MODE_META[applyMode].label}
            aria-labelledby={APPLY_MODE_META[applyMode].label}
            options={Object.entries(APPLY_MODE_META).map(([value, meta]) => ({
              value: value as ApplyMode,
              label: meta.label,
              icon: meta.icon,
            }))}
            onChange={(e) => {
              const next = e.currentTarget.value as ApplyMode
              setApplyMode(next)
            }}
            defaultValue={applyMode}
          />
        </SearchCategory>
      </Modal>
    </>
  )
}
