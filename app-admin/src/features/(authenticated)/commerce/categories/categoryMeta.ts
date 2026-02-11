import { LevelType } from '@/features/(authenticated)/commerce/categories/types/DepthType'

export const getMeta = (type: LevelType) =>
  (
    ({
      1: {
        label: '1 계층',
        hint: '루트 카테고리 선택',
        badge: 'ROOT',
        badgeClass: 'bg-yellow-100/5 text-yellow-700 border-yellow-200',
        noSelected: '선택하지 않으면 루트로 등록돼요.',
      },
      2: {
        label: '2 계층',
        hint: '하위 카테고리 선택',
        badge: 'SUB',
        badgeClass: 'bg-blue-100/5 text-blue-700 border-blue-200',
        noSelected: '선택하지 않으면 1계층 하위로 등록돼요.',
      },
      3: {
        label: '3 계층',
        hint: '최종 카테고리 선택',
        badge: 'LEAF',
        badgeClass: 'bg-emerald-100/5 text-emerald-700 border-emerald-200',
        noSelected: '2계층 하위로 등록돼요.',
      },
    }) as const
  )[type]
