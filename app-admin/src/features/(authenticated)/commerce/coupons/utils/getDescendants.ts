import { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoriesForCoupon'

export function getDescendants(target: CategoryListItem, allCategories: CategoryListItem[]) {
  return allCategories.filter(
    (item) => item.id !== target.id && String(item.path).startsWith(`${String(target.path)}.`),
  )
}
