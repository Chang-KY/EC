import clsx from 'clsx'
import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  inputClassName?: string
}

const Input = (props: InputProps) => {
  const { inputClassName, ...rest } = props

  return (
    <input
      {...rest}
      className={clsx(
        'h-10 max-h-10 min-h-10 w-full rounded border border-gray-800 bg-gray-900 py-2 pl-3 text-sm ring-2 ring-transparent outline-none focus:border-gray-500',
        inputClassName,
      )}
    />
  )
}

export default Input
