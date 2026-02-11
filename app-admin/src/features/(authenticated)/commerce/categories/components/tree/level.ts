import { LevelType } from '@/features/(authenticated)/commerce/categories/types/DepthType'

export const levelOfDepth = (depth: number): LevelType => {
  // depth: 0(root)도 1계층 색으로 맞춤
  if (depth <= 1) return 1
  if (depth === 2) return 2
  return 3
}

export const LEVEL = {
  1: {
    card: 'bg-yellow-100 border-yellow-700 text-gray-700',
    headerBorder: 'border-yellow-200',
    dot: 'bg-yellow-200',
    linkStroke: 'rgb(254,240,138)', // yellow-200
  },
  2: {
    card: 'bg-blue-100 border-blue-700 text-gray-700',
    headerBorder: 'border-blue-200',
    dot: 'bg-blue-200',
    linkStroke: 'rgb(191,219,254)', // blue-200
  },
  3: {
    card: 'bg-emerald-100 border-emerald-700 text-gray-700',
    headerBorder: 'border-emerald-200',
    dot: 'bg-emerald-200',
    linkStroke: 'rgb(167,243,208)', // emerald-200
  },
} as const
