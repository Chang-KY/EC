import { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoriesForCoupon'

export function getBranchCategories(target: CategoryListItem, allCategories: CategoryListItem[]) {
  return allCategories.filter(
    (item) => item.path === target.path || String(item.path).startsWith(`${String(target.path)}.`),
  )
}