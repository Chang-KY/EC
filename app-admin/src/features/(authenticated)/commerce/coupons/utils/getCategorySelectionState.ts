import { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoriesForCoupon'
import { getDescendants } from '@/features/(authenticated)/commerce/coupons/utils/getDescendants'

export function getCategorySelectionState(
  category: CategoryListItem,
  selectedIds: Set<number>,
  allCategories?: CategoryListItem[],
): 'checked' | 'partial' | 'unchecked' {
  const selfSelected = selectedIds.has(Number(category.id))
  let descendants: CategoryListItem[] = []
  if (allCategories && allCategories.length > 0) {
    descendants = getDescendants(category, allCategories)
  }

  if (descendants.length === 0) {
    return selfSelected ? 'checked' : 'unchecked'
  }

  const selectedDescendantsCount = descendants.filter((item) =>
    selectedIds.has(Number(item.id)),
  ).length

  if (selfSelected && selectedDescendantsCount === descendants.length) {
    return 'checked'
  }

  if (selfSelected || selectedDescendantsCount > 0) {
    return 'partial'
  }

  return 'unchecked'
}
