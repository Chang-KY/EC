'use client'

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import Input from '@/components/ui/Input'
import clsx from 'clsx'

type BaseInputProps = React.ComponentProps<typeof Input>

export type InputNumberNotFormProps = Omit<
  BaseInputProps,
  'value' | 'defaultValue' | 'onChange'
> & {
  value?: string | number
  defaultValue?: BaseInputProps['defaultValue']
  onValueChange?: (raw: string, formatted: string, num: number | null) => void
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

function digitsOnly(v: string) {
  return v.replace(/[^\d]/g, '')
}

function formatWithComma(rawDigits: string) {
  if (!rawDigits) return ''
  const normalized = rawDigits.replace(/^0+(?=\d)/, '')
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function caretPosByDigits(formatted: string, digitCountLeft: number) {
  if (digitCountLeft <= 0) return 0
  let count = 0
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) count++
    if (count === digitCountLeft) return i + 1
  }
  return formatted.length
}

export const InputNumberNotForm = React.forwardRef<HTMLInputElement, InputNumberNotFormProps>(
  ({ value, defaultValue, onValueChange, onChange, inputMode, pattern, ...rest }, forwardedRef) => {
    const innerRef = useRef<HTMLInputElement | null>(null)
    const setRefs = (el: HTMLInputElement | null) => {
      innerRef.current = el
      if (typeof forwardedRef === 'function') forwardedRef(el)
      else if (forwardedRef) forwardedRef.current = el
    }

    const isControlled = value !== undefined

    const controlledFormatted = useMemo(() => {
      if (!isControlled) return undefined
      const raw = digitsOnly(String(value ?? ''))
      return formatWithComma(raw)
    }, [isControlled, value])

    const [uncontrolledFormatted, setUncontrolledFormatted] = useState(() => {
      const raw = digitsOnly(String(defaultValue ?? ''))
      return formatWithComma(raw)
    })

    const displayValue = isControlled ? controlledFormatted! : uncontrolledFormatted

    const pendingDigitLeftRef = useRef<number | null>(null)

    useLayoutEffect(() => {
      const input = innerRef.current
      const pending = pendingDigitLeftRef.current
      if (!input || pending == null) return
      const nextPos = caretPosByDigits(displayValue, pending)
      input.setSelectionRange(nextPos, nextPos)
      pendingDigitLeftRef.current = null
    }, [displayValue])

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const nextText = e.target.value
      const caret = e.target.selectionStart ?? nextText.length

      const digitLeft = digitsOnly(nextText.slice(0, caret)).length
      pendingDigitLeftRef.current = digitLeft

      const raw = digitsOnly(nextText)
      const formatted = formatWithComma(raw)
      const num = raw ? Number(raw) : null

      if (!isControlled) setUncontrolledFormatted(formatted)

      onValueChange?.(raw, formatted, num)
      onChange?.(e)
    }

    return (
      <div className="relative w-full">
        <input
          {...rest}
          ref={setRefs}
          {...rest}
          value={displayValue}
          onChange={handleChange}
          inputMode={inputMode ?? 'numeric'}
          pattern={pattern ?? '[0-9]*'}
          autoComplete={rest.autoComplete ?? 'off'}
          className={clsx(
            'max-h-10 min-h-7 w-full rounded border py-2 pr-3 text-sm ring-0 outline-none',
            'dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-gray-500',
            'border-gray-300 bg-white text-gray-700 focus:border-indigo-200 focus:ring-1 focus:ring-indigo-200',
            // icon ? 'pl-8' : 'pl-3',
            // className,
          )}
        />
        {/*{icon && (*/}
        {/*  <div className="absolute inset-y-0 left-2 flex items-center justify-center text-gray-600">*/}
        {/*    {icon}*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    )
  },
)

InputNumberNotForm.displayName = 'InputNumberNotForm'
