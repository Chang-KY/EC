import React from 'react'
import clsx from 'clsx'

type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked' | 'onChange'
> & {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  mention?: string
  labelClassName?: string
}

export default function Checkbox({
  checked,
  onCheckedChange,
  className,
  mention,
  labelClassName,
  ...props
}: CheckboxProps) {
  return (
    <label
      className={clsx(
        'inline-flex cursor-pointer items-center gap-2 text-xs text-gray-600 dark:text-gray-300',
        labelClassName,
      )}
    >
      <input
        {...props}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className={clsx(
          'size-3 rounded border-gray-200 text-indigo-600 focus:ring-indigo-200',
          'dark:border-gray-700 dark:bg-black',
          className,
        )}
      />
      {mention && mention}
    </label>
  )
}
