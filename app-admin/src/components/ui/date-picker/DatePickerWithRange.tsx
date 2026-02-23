'use client'

import * as React from 'react'
import { CalendarClock } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import clsx from 'clsx'
import Label from '@/components/ui/Label'
import Required from '@/components/ui/Required'
import ErrorMessage from '@/components/ui/ErrorMessage'

type DatePickerWithRangeProps = {
  required?: boolean
  errorMessage?: string
  name: string
  label?: string
  className?: string
}

export function DatePickerWithRange(props: DatePickerWithRangeProps) {
  const { name, label, required, errorMessage, className } = props
  const [range, setRange] = React.useState<DateRange | undefined>()

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
          <div className="relative w-full">
            <div
              className={clsx(
                'max-h-10 min-h-[38px] w-full rounded border py-2 pr-3 text-sm ring-0 outline-none',
                'dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-gray-500',
                'border-gray-300 bg-white pl-3 text-gray-700 focus:border-indigo-200 focus:ring-1 focus:ring-indigo-200',
                className,
              )}
            >
              df
            </div>
            <div className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-600">
              <CalendarClock className="size-6.5 cursor-pointer rounded-full bg-indigo-500/20 p-1 opacity-100 hover:opacity-80" />
            </div>
          </div>
        </PopoverTrigger>
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
