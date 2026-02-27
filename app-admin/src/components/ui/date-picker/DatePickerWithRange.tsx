'use client'

import * as React from 'react'
import type { DateRange } from 'react-day-picker'
import { CalendarClock } from 'lucide-react'
import clsx from 'clsx'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Label from '@/components/ui/Label'
import Required from '@/components/ui/Required'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { dateTimeFormat } from '@/utils/DateTimeFormat'

type DefaultValue =
  | ''
  | string
  | DateRange
  | { from?: string | null; to?: string | null }
  | null
  | undefined

type DatePickerWithRangeProps = {
  name: string
  label?: string
  required?: boolean
  errorMessage?: string
  className?: string
  placeholder?: string

  /** 컨트롤드로 쓰고 싶을 때 */
  value?: DateRange
  onChange?: (next: DateRange | undefined) => void

  /** 언컨트롤드 초기값 */
  defaultValue?: DefaultValue

  /** hidden input 저장 포맷 (기본: {"from":"YYYY-MM-DD","to":"YYYY-MM-DD"|null}) */
  serialize?: (range: DateRange) => string
}

function parseDefaultRange(v: DefaultValue): DateRange | undefined {
  if (!v) return undefined
  if (typeof v === 'object' && 'from' in v && typeof v.from !== 'undefined') {
    const from = v.from ? new Date(v.from) : undefined
    const to = v.to ? new Date(v.to) : undefined
    return from ? { from, to } : undefined
  }
  if (typeof v === 'object' && 'from' in (v)) {
    // DateRange 형태
    const dr = v as DateRange
    return dr?.from ? dr : undefined
  }
  if (typeof v === 'string') {
    const s = v.trim()
    if (!s) return undefined
    // JSON 문자열 지원: {"from":"2026-02-23","to":"2026-02-28"}
    try {
      const obj = JSON.parse(s) as { from?: string | null; to?: string | null }
      const from = obj.from ? new Date(obj.from) : undefined
      const to = obj.to ? new Date(obj.to) : undefined
      return from ? { from, to } : undefined
    } catch {
      return undefined
    }
  }
  return undefined
}

export function DatePickerWithRange(props: DatePickerWithRangeProps) {
  const {
    name,
    label,
    required,
    errorMessage,
    className,
    placeholder = '기간을 선택해 주세요',
    defaultValue,
    value,
    onChange,
    serialize,
  } = props

  // value prop이 "존재"하면 컨트롤드로 취급 (undefined여도)
  const isControlled = 'value' in props
  const [inner, setInner] = React.useState<DateRange | undefined>(() =>
    parseDefaultRange(defaultValue),
  )

  const range = isControlled ? value : inner

  const setRange = React.useCallback(
    (next: DateRange | undefined) => {
      if (!isControlled) setInner(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  const displayText = React.useMemo(() => {
    if (!range?.from) return placeholder
    if (!range.to) return `${dateTimeFormat(range.from, 'date')} ~`
    return `${dateTimeFormat(range.from, 'date')} ~ ${dateTimeFormat(range.to, 'date')}`
  }, [range, placeholder])

  const hiddenValue = React.useMemo(() => {
    if (!range?.from) return '' // 무기한
    if (serialize) return serialize(range)

    return JSON.stringify({
      from: dateTimeFormat(range.from, 'date'),
      to: range.to ? dateTimeFormat(range.to, 'date') : null,
    })
  }, [range, serialize])

  return (
    <Popover>
      <div className={clsx('flex flex-col gap-1')}>
        {label && (
          <div className="flex items-center">
            <Label name={name} label={label} />
            {required && <Required />}
          </div>
        )}

        <PopoverTrigger asChild>
          <button
            type="button"
            className={clsx(
              'relative w-full text-left',
              'max-h-10 min-h-[38px] rounded border py-2 pr-10 text-sm outline-none',
              'dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-gray-500',
              'border-gray-300 bg-white pl-3 text-gray-700 focus:border-indigo-200 focus:ring-1 focus:ring-indigo-200',
              className,
            )}
          >
            <span className={clsx(!range?.from && 'text-gray-400 dark:text-gray-500')}>
              {displayText}
            </span>

            <span className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-600">
              <CalendarClock className="size-6.5 rounded-full bg-indigo-500/20 p-1 opacity-100 hover:opacity-80" />
            </span>
          </button>
        </PopoverTrigger>

        <input type="hidden" name={name} value={hiddenValue} />

        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
      </div>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          numberOfMonths={2}
          defaultMonth={range?.from}
          selected={range}
          onSelect={setRange}
        />
      </PopoverContent>
    </Popover>
  )
}
