import clsx from 'clsx'
import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  inputClassName?: string
  icon?: React.ReactNode
}

const Input = (props: InputProps) => {
  const { inputClassName, icon, ...rest } = props

  return (
    <div className="relative">
      <input
        {...rest}
        className={clsx(
          'h-10 w-full rounded border py-2 pr-3 text-sm ring-0 outline-none',
          'dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-gray-500',
          'border-gray-300 bg-white text-gray-700 focus:border-indigo-200 focus:ring-1 focus:ring-indigo-200',
          icon ? 'pl-8' : 'pl-3',
          inputClassName,
        )}
      />
      {icon && (
        <div className="absolute inset-y-0 left-2 flex items-center justify-center text-gray-600">
          {icon}
        </div>
      )}
    </div>
  )
}

export default Input
