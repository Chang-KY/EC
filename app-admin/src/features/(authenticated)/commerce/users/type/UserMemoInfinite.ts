import { USERS_MEMO_TABLE } from '@/types/db'

export type UserMemoInfinite = {
  items: USERS_MEMO_TABLE['Row'][]
  nextCursor: string | null
}
