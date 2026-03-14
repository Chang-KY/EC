import { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoriesForCoupon'

export function uniqueById(items: CategoryListItem[]) {
  const map = new Map<number, CategoryListItem>()

  for (const item of items) {
    map.set(Number(item.id), item)
  }

  return Array.from(map.values())
}
