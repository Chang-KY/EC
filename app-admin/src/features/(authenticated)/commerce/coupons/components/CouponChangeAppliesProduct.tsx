'use client'

import React, { useState } from 'react'
import { Bolt } from 'lucide-react'
import { iconButtonClassName } from '@/constants/iconButtonClassName'
import Modal from '@/components/modal/Modal'
import AppButton from '@/components/ui/AppButton'
import SearchProductForCoupon from '@/features/(authenticated)/commerce/coupons/components/SearchProductForCoupon'
import { PRODUCTS_TABLE } from '@/types/db'
import { ApplyMode } from '@/types/enum'
import { APPLY_MODE_META } from '@/features/(authenticated)/commerce/coupons/applyModeSchema'
import Select from '@/components/ui/Select'
import { useUpdateAppliesProduct } from '@/features/(authenticated)/commerce/coupons/hooks/useUpdateAppliesProduct'
import clsx from 'clsx'
import { toast } from 'react-toastify'

type CouponChangeAppliesProductProps = {
  selectedProducts: PRODUCTS_TABLE['Row'][]
  selectedApply: ApplyMode
  couponId: number
}

export default function CouponChangeAppliesProduct(props: CouponChangeAppliesProductProps) {
  const { selectedApply, selectedProducts, couponId } = props
  const [isOpen, setIsOpen] = useState(false)
  const [applyMode, setApplyMode] = useState<ApplyMode>(selectedApply)
  const [appliesProductList, setAppliesProductList] = useState<PRODUCTS_TABLE['Row'][]>(
    selectedProducts ?? [],
  )
  const { mutate, mutateAsync, isPending, isError, error } = useUpdateAppliesProduct()

  const handleClick = () => {
    mutate(
      {
        id: couponId,
        product_mode: applyMode,
        product_ids: appliesProductList.map((p) => p.id),
      },
      {
        onSuccess: () => {
          setIsOpen(false)
          toast.success('변경 완료', { toastId: 'updateAppliesProductList' })
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
        headerTitle="적용할 상품"
        subHeaderTitle="상품을 선택 후 적용 버튼을 클릭해주세요."
        footerButton={[
          <AppButton key="cancel-applies-product" variant="cancel" onClick={() => setIsOpen(false)}>
            취소
          </AppButton>,
          <AppButton
            variant="update"
            onClick={handleClick}
            disabled={isPending}
            key="update-applies-product"
          >
            변경
          </AppButton>,
        ]}
      >
        <SearchProductForCoupon
          mode={applyMode}
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
        </SearchProductForCoupon>
      </Modal>
    </>
  )
}
