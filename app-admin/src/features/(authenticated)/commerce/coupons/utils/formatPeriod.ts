import { dateTimeFormat } from '@/utils/DateTimeFormat'

export function formatPeriod(startsAt: string | null, endsAt: string | null) {
  if (!startsAt && !endsAt) return '무기한'
  return `${startsAt ? dateTimeFormat(startsAt, 'datetime') : '-'} ~ ${endsAt ? dateTimeFormat(endsAt, 'datetime') : '-'}`
}
