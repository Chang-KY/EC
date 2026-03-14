'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { couponUpdateNotesAction } from '@/features/(authenticated)/commerce/coupons/update/basicInfoActions'

type UpdateCouponNotesPayload = {
  id: number
  notes: string | null
}

type UseUpdateCouponNotesProps = {
  couponId: number
  onSuccessClose?: () => void
}

export function useUpdateCouponNotes({ couponId, onSuccessClose }: UseUpdateCouponNotesProps) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (payload: UpdateCouponNotesPayload) => {
      return couponUpdateNotesAction(payload)
    },
    onSuccess: async (res) => {
      if (!res?.ok) return

      onSuccessClose?.()

      await queryClient.invalidateQueries({
        queryKey: ['coupon', couponId],
      })

      router.refresh()
    },
  })
}
