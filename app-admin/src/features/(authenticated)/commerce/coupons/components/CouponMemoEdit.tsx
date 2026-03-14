'use client'

import React from 'react'
import { Pencil } from 'lucide-react'
import { iconButtonClassName } from '@/constants/iconButtonClassName'
import clsx from 'clsx'
import Modal from '@/components/modal/Modal'
import AppButton from '@/components/ui/AppButton'
import { useUpdateCouponNotes } from '@/features/(authenticated)/commerce/coupons/hooks/useEditMemo'

type CouponMemoEditProps = {
  couponId: number
  initialNotes?: string | null
}

export default function CouponMemoEdit({ couponId, initialNotes }: CouponMemoEditProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [savedNotes, setSavedNotes] = React.useState(initialNotes ?? '')
  const [notes, setNotes] = React.useState(initialNotes ?? '')

  React.useEffect(() => {
    const next = initialNotes ?? ''
    setSavedNotes(next)
    setNotes(next)
  }, [initialNotes])

  const handleClose = React.useCallback(() => {
    setIsOpen(false)
    setNotes(savedNotes)
  }, [savedNotes])

  const notesMutation = useUpdateCouponNotes({
    couponId,
    onSuccessClose: () => {
      setSavedNotes(notes)
      setIsOpen(false)
    },
  })

  const handleSave = () => {
    notesMutation.mutate({
      id: couponId,
      notes: notes.trim() ? notes : null,
    })
  }

  return (
    <>
      <button
        type="button"
        className={clsx(iconButtonClassName, 'absolute top-5 right-5')}
        onClick={() => setIsOpen(true)}
      >
        <Pencil size={14} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        headerTitle="메모"
        subHeaderTitle="해당 쿠폰에 관련된 메모를 작성해주세요."
        footerButton={[
          <AppButton
            key="memo-cancel"
            variant="cancel"
            onClick={handleClose}
            disabled={notesMutation.isPending}
          >
            취소
          </AppButton>,
          <AppButton
            key="memo-add"
            variant="add"
            onClick={handleSave}
            disabled={notesMutation.isPending}
          >
            작성
          </AppButton>,
        ]}
      >
        <textarea
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={notesMutation.isPending}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-1"
        />
      </Modal>
    </>
  )
}
