'use client'

import * as React from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { ko as dayPickerKo } from 'react-day-picker/locale'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/cn'
import Input from '@/components/ui/Input'

type DateTimePickerFieldProps = {
  name: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  includeTime?: boolean
  boundary?: 'start' | 'end'
}

function getDefaultTime(boundary: 'start' | 'end') {
  return boundary === 'start' ? '00:00' : '23:59'
}

function mergeDateAndTime(date: Date, timeValue: string) {
  const [hour, minute] = timeValue.split(':').map(Number)

  return dayjs(date)
    .hour(Number.isNaN(hour) ? 0 : hour)
    .minute(Number.isNaN(minute) ? 0 : minute)
    .second(0)
    .millisecond(0)
    .toDate()
}

export default function DateTimePickerField({
  name,
  value,
  onChange,
  placeholder = '날짜를 선택하세요',
  className,
  disabled = false,
  includeTime = false,
  boundary = 'start',
}: DateTimePickerFieldProps) {
  const defaultTime = React.useMemo(() => getDefaultTime(boundary), [boundary])

  const [time, setTime] = React.useState(() => {
    if (!value) return defaultTime
    return dayjs(value).format('HH:mm')
  })

  React.useEffect(() => {
    if (!value) {
      setTime(defaultTime)
      return
    }

    setTime(dayjs(value).format('HH:mm'))
  }, [value, defaultTime])

  const handleSelectDate = (nextDate: Date | undefined) => {
    if (!nextDate) {
      onChange?.(undefined)
      return
    }

    const appliedTime = includeTime ? time : defaultTime
    onChange?.(mergeDateAndTime(nextDate, appliedTime))
  }

  const handleChangeTime = (nextTime: string) => {
    setTime(nextTime)

    if (!value) return
    onChange?.(mergeDateAndTime(value, nextTime))
  }

  const submitValue = React.useMemo(() => {
    if (!value) return ''

    if (includeTime) {
      return dayjs(value).format('YYYY-MM-DDTHH:mm:ss')
    }

    if (boundary === 'start') {
      return dayjs(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss')
    }

    return dayjs(value).endOf('day').format('YYYY-MM-DDTHH:mm:ss')
  }, [value, includeTime, boundary])

  const displayText = React.useMemo(() => {
    if (!value) return placeholder

    if (includeTime) {
      return dayjs(value).locale('ko').format('YYYY.MM.DD HH:mm')
    }

    return dayjs(value).locale('ko').format('YYYY.MM.DD')
  }, [value, includeTime, placeholder])

  return (
    <div className={cn('space-y-2', className)}>
      <input type="hidden" name={name} value={submitValue} />

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'flex h-[34px] w-full items-center rounded border border-gray-300 px-3 text-left font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {displayText}
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelectDate}
            locale={dayPickerKo}
          />
        </PopoverContent>
      </Popover>

      {includeTime && (
        <div className="relative h-[34px]">
          <Input
            type="time"
            step="60"
            value={time}
            onChange={(e) => handleChangeTime(e.target.value)}
            disabled={disabled || !value}
          />
          <span className="absolute inset-y-0 right-9 flex items-center text-xs text-gray-700">
            날짜 먼저 선택해줘요
          </span>
        </div>
      )}
    </div>
  )
}
