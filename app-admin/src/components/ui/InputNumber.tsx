'use client'

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

type CommaNumberInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange' | 'name'
> & {
  name: string
  className?: string
}

function formatWithComma(rawDigits: string) {
  if (!rawDigits) return ''
  const normalized = rawDigits.replace(/^0+(?=\d)/, '')
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function digitsOnly(v: string) {
  return v.replace(/[^\d]/g, '')
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

export default function InputNumber(props: CommaNumberInputProps) {
  const { name, defaultValue, className, ...rest } = props

  const initialRaw = useMemo(() => {
    if (defaultValue === undefined || defaultValue === null) return ''
    return digitsOnly(String(defaultValue))
  }, [defaultValue])

  const [raw, setRaw] = useState(initialRaw) // "1000"
  const [view, setView] = useState(formatWithComma(initialRaw)) // "1,000"
  const inputRef = useRef<HTMLInputElement | null>(null)
  const nextCaretRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    const pos = nextCaretRef.current
    if (pos !== null && inputRef.current) {
      inputRef.current.setSelectionRange(pos, pos)
      nextCaretRef.current = null
    }
  }, [view])

  return (
    <div className="relative w-full">
      {/* 실제로 제출될 값 */}
      <input type="hidden" name={name} value={raw} />

      {/* 사용자에게 보이는 값(콤마 포함) */}
      <input
        {...rest}
        ref={inputRef}
        name={undefined}
        type="text"
        inputMode="numeric"
        pattern="[0-9,]*"
        value={view}
        onChange={(e) => {
          const next = e.target.value
          const cursor = e.target.selectionStart ?? next.length
          const digitLeft = (next.slice(0, cursor).match(/\d/g) || []).length

          const nextRaw = digitsOnly(next)
          const nextView = formatWithComma(nextRaw)

          setRaw(nextRaw)
          setView(nextView)

          nextCaretRef.current = caretPosByDigits(nextView, digitLeft)
        }}
        className={clsx(
          'max-h-10 min-h-7 w-full rounded border py-2 pr-3 text-sm ring-0 outline-none',
          'dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-gray-500',
          'border-gray-300 bg-white text-gray-700 focus:border-indigo-200 focus:ring-1 focus:ring-indigo-200',
          'pl-3',
          className,
        )}
      />
    </div>
  )
}
