import { useMutation } from '@tanstack/react-query'
import { CouponUpdateFormValues } from '@/features/(authenticated)/commerce/coupons/update/updateSchema'
import { couponUpdateProductModeAction } from '@/features/(authenticated)/commerce/coupons/update/updateAppliesAction'

export function useUpdateAppliesProduct() {
  return useMutation({
    mutationFn: async (data: CouponUpdateFormValues) => {
      return await couponUpdateProductModeAction(data)
    },
    onSuccess: async (_, variables) => {},
  })
}
