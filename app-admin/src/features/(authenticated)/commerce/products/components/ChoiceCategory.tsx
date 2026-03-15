'use client'

import Modal from '@/components/modal/Modal'
import React, { useState } from 'react'
import Label from '@/components/ui/Label'
import Required from '@/components/ui/Required'
import { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoryRootForCoupon'
import { ProductCategoryRoleCode } from '@/types/enum'
import { Check } from 'lucide-react'
import { iconButtonClassName } from '@/constants/iconButtonClassName'
import SearchCategoryForProduct from '@/features/(authenticated)/commerce/products/components/SearchCategoryForProduct'
import AppButton from '@/components/ui/AppButton'

type ChoiceCategoryProps = {
  roleCode: ProductCategoryRoleCode
  required?: boolean
}

export default function ChoiceCategory(props: ChoiceCategoryProps) {
  const { roleCode, required } = props
  const [isOpen, setIsOpen] = useState(false)
  const [appliesCategoryList, setAppliesCategoryList] = useState<CategoryListItem[]>([])
  const [draftCategoryList, setDraftCategoryList] = useState<CategoryListItem[]>(appliesCategoryList)
  const selectedCategory = appliesCategoryList[0]

  const handleOpenModal = () => {
    setDraftCategoryList(appliesCategoryList)
    setIsOpen(true)
  }

  const handleCloseModal = () => {
    setDraftCategoryList(appliesCategoryList)
    setIsOpen(false)
  }

  const handleSelectCategory = (category: CategoryListItem) => {
    setDraftCategoryList([category])
  }

  const handleApplyCategory = () => {
    setAppliesCategoryList(draftCategoryList)
    setIsOpen(false)
  }

  return (
    <>
      {selectedCategory && (
        <>
          <input
            type="hidden"
            name="products.categories.category_id"
            value={String(selectedCategory.id)}
          />
          <input
            type="hidden"
            name={`products.categories.${roleCode}.category_role_code`}
            value={String(roleCode)}
          />
        </>
      )}

      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <Label name={roleCode} label={roleCode === 'primary' ? '메인' : '서브'} />
          {required && <Required />}
        </div>

        <div className="flex h-8.5 items-center justify-between rounded border border-gray-300 px-3 text-xs">
          <p className="text-xs text-gray-500">
            {selectedCategory ? selectedCategory.name : '카테고리 선택'}
          </p>
          <button className={iconButtonClassName} type="button" onClick={handleOpenModal}>
            <Check size={14} />
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        headerTitle="카테고리 선택"
        subHeaderTitle="적용할 카테고리 1개를 선택해주세요."
        footerButton={[
          <AppButton variant="cancel" key="cancel-product-category" onClick={handleCloseModal}>
            취소
          </AppButton>,
          <AppButton variant="update" key="apply-product-category" onClick={handleApplyCategory}>
            적용
          </AppButton>,
        ]}
      >
        <SearchCategoryForProduct
          selectedCategories={draftCategoryList}
          onSelectCategories={handleSelectCategory}
        />
      </Modal>
    </>
  )
}
