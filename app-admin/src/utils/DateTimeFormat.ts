import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import 'dayjs/locale/ko.js'

dayjs.extend(relativeTime)
dayjs.locale('ko')

/**
 * 날짜 문자열을 지정된 형식으로 변환합니다.
 *
 * @param {string | Date} dateInput - ISO 문자열 또는 Date 객체
 * @param {"default" | "date" | "datetime" | "short" | "relative"} [formatType="default"]
 *        - 출력 형식:
 *          - `"default"`: `YYYY.MM.DD HH:mm`
 *          - `"date"`: `YYYY.MM.DD`
 *          - `"datetime"`: `YYYY-MM-DD HH:mm:ss`
 *          - `"short"`: 로케일 기반 짧은 형식 (예: `25. 10. 10. 오후 5:20`)
 *          - `"relative"`: "2시간 전", "3일 전" 등 상대 시간
 * @returns {string} 포맷된 날짜 문자열
 *
 * @example
 * dateTimeFormat("2025-10-10T17:20:52.096047+00", "default"); // "2025.10.10 17:20"
 * dateTimeFormat(new Date(), "relative"); // "방금 전"
 */
export function dateTimeFormat(
  dateInput: string | Date | null | undefined,
  formatType: 'default' | 'date' | 'datetime' | 'short' | 'relative' = 'default',
): string {
  // 1) null / undefined / 빈 문자열이면 바로 '-'
  if (dateInput == null || dateInput === '') return '-'

  const date = dayjs(dateInput)

  // 2) dayjs가 파싱 못 하면 '-'
  if (!date.isValid()) return '-'

  // 3) 유효한 날짜면 타입에 맞게 포맷
  switch (formatType) {
    case 'date':
      return date.format('YYYY.MM.DD')
    case 'datetime':
      return date.format('YYYY-MM-DD HH:mm:ss')
    case 'short':
      return date.format('YY.MM.DD HH:mm')
    case 'relative':
      return date.fromNow()
    case 'default':
    default:
      return date.format('YYYY.MM.DD HH:mm')
  }
}
