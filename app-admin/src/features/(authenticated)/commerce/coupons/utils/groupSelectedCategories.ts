import { CategoryListItem } from '@/features/(authenticated)/commerce/coupons/list/getCategoriesForCoupon'

type SelectionState = 'all' | 'partial'

export function groupSelectedCategories(
  appliesCategoryList: CategoryListItem[],
  allCategories: CategoryListItem[],
) {
  const selectedSorted = [...appliesCategoryList].sort((a, b) =>
    String(a.path).localeCompare(String(b.path)),
  )

  const roots = selectedSorted.filter((item) => {
    return !selectedSorted.some(
      (maybeParent) =>
        maybeParent.id !== item.id && String(item.path).startsWith(`${String(maybeParent.path)}.`),
    )
  })

  return roots.map((root) => {
    const selectedDescendants = selectedSorted.filter(
      (item) => item.id !== root.id && String(item.path).startsWith(`${String(root.path)}.`),
    )

    const totalDescendants = allCategories.filter(
      (item) => item.id !== root.id && String(item.path).startsWith(`${String(root.path)}.`),
    )

    const selectionState: SelectionState =
      selectedDescendants.length === totalDescendants.length ? 'all' : 'partial'

    return {
      root,
      descendants: selectedDescendants,
      totalDescendantsCount: totalDescendants.length,
      selectedDescendantsCount: selectedDescendants.length,
      selectionState,
    }
  })
}
