import { useMutation } from '@tanstack/react-query'
import { CouponUpdateFormValues } from '@/features/(authenticated)/commerce/coupons/update/updateSchema'
import {
  couponUpdateCategoryModeAction,
  couponUpdateProductModeAction,
} from '@/features/(authenticated)/commerce/coupons/update/updateAppliesAction'

export function useUpdateAppliesCategory() {
  return useMutation({
    mutationFn: async (data: CouponUpdateFormValues) => {
      return await couponUpdateCategoryModeAction(data)
    },
    onSuccess: async (_, variables) => {},
  })
}
