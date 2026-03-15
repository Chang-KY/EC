import { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoriesForCoupon'

export type CategorySelectionState = 'checked' | 'partial' | 'none'

export function getProductCategorySelectionState(
  category: CategoryListItem,
  selectedIds: Set<number>,
  allCategories?: CategoryListItem[],
): CategorySelectionState {
  const currentId = Number(category.id)

  // 자기 자신이 선택되어 있으면 무조건 checked 우선
  if (selectedIds.has(currentId)) {
    return 'checked'
  }

  if (!allCategories || allCategories.length === 0) {
    return 'none'
  }

  const currentPath = String(category.path)
  const childPrefix = `${currentPath}.`

  const hasSelectedDescendant = allCategories.some((item) => {
    const itemId = Number(item.id)
    const itemPath = String(item.path)

    return selectedIds.has(itemId) && itemPath.startsWith(childPrefix)
  })

  if (hasSelectedDescendant) {
    return 'partial'
  }

  return 'none'
}
