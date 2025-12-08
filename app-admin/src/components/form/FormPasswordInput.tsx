'use client'

import React, { useState } from 'react'
import Label from '@/components/ui/Label'
import Required from '@/components/ui/Required'
import Input from '@/components/ui/Input'
import ErrorMessage from '@/components/ui/ErrorMessage'
import clsx from 'clsx'
import { Eye, EyeOff } from 'lucide-react'

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  errorMessage?: string
  name: string
  inputClassName?: string
  outerClassName?: string
}

const FormPasswordInput = (props: FormInputProps) => {
  const { label, errorMessage, required, name, inputClassName, outerClassName, type, ...rest } =
    props

  const isPassword = type === 'password'
  const [showPassword, setShowPassword] = useState(false)

  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className={clsx('flex flex-col gap-1', outerClassName)}>
      {label && (
        <div className="flex items-center">
          <Label name={name} label={label} />
          {required && <Required />}
        </div>
      )}
      <div className={clsx(isPassword && 'relative')}>
        <Input
          required={required}
          name={name}
          aria-label={label}
          aria-labelledby={label}
          inputClassName={clsx(inputClassName, isPassword && 'pr-8')}
          type={inputType}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-500 opacity-100 transition duration-200 hover:text-gray-700 hover:opacity-80 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  )
}

export default FormPasswordInput
