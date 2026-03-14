import { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoriesForCoupon'
import { getDescendants } from '@/features/(authenticated)/commerce/coupons/utils/getDescendants'

export function normalizeSelectedCategories(
  selected: CategoryListItem[],
  allCategories: CategoryListItem[],
) {
  const selectedIdSet = new Set(selected.map((item) => Number(item.id)))

  // 깊은 depth부터 부모 방향으로 올라가며 검사
  const sorted = [...allCategories].sort((a, b) => (b.depth ?? 0) - (a.depth ?? 0))

  for (const category of sorted) {
    const descendants = getDescendants(category, allCategories)

    if (descendants.length === 0) continue

    const allDescendantsSelected = descendants.every((item) => selectedIdSet.has(Number(item.id)))

    if (allDescendantsSelected) {
      selectedIdSet.add(Number(category.id))
    } else {
      selectedIdSet.delete(Number(category.id))
    }
  }

  return allCategories.filter((item) => selectedIdSet.has(Number(item.id)))
}
