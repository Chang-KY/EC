// queryKeys.ts
export const userMemoKeys = {
  all: ['user-memo'] as const,

  lists: () => [...userMemoKeys.all, 'list'] as const,
  list: (userId: string) => [...userMemoKeys.lists(), userId] as const,

  details: () => [...userMemoKeys.all, 'detail'] as const,
  detail: (memoId: number) => [...userMemoKeys.details(), memoId] as const,

  counts: () => [...userMemoKeys.all, 'count'] as const,
  count: (userId: string) => [...userMemoKeys.counts(), userId] as const,
} as const
