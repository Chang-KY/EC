'use client'

import React from 'react'
import clsx from 'clsx'

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string
  placeholder?: string
  selectNoValue?: boolean
  options: { label: React.ReactNode; value: string }[]
}

export default function Select(props: SelectProps) {
  const { className, options, selectNoValue, placeholder, ...rest } = props
  return (
    <select
      {...rest}
      className={clsx(
        'max-h-10 min-h-7 rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-800',
        className,
      )}
    >
      <option
        value=""
        disabled={!selectNoValue}
        className="bg-gray-100 text-gray-400 dark:bg-gray-900"
      >
        {placeholder ? placeholder : '선택하세요'}
      </option>
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          className="flex items-center bg-white dark:bg-gray-800"
        >
          {opt.label}
        </option>
      ))}
    </select>
  )
}
