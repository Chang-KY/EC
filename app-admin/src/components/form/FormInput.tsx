import React from 'react'
import Label from '@/components/ui/Label'
import Required from '@/components/ui/Required'
import Input from '@/components/ui/Input'
import ErrorMessage from '@/components/ui/ErrorMessage'
import clsx from 'clsx'
import InputNumber from '@/components/ui/InputNumber'

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  errorMessage?: string
  name: string
  inputClassName?: string
  outerClassName?: string
}

const FormInput = (props: FormInputProps) => {
  const { label, errorMessage, required, type, name, inputClassName, outerClassName, ...rest } =
    props

  return (
    <div className={clsx('flex flex-col gap-1', outerClassName)}>
      {label && (
        <div className="flex items-center">
          <Label name={name} label={label} />
          {required && <Required />}
        </div>
      )}
      {type === 'number' ? (
        <InputNumber
          required={required}
          name={name}
          aria-label={label}
          aria-labelledby={label}
          className={inputClassName}
          {...rest}
        />
      ) : (
        <Input
          required={required}
          name={name}
          aria-label={label}
          aria-labelledby={label}
          className={inputClassName}
          type={type}
          {...rest}
        />
      )}
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  )
}

export default FormInput
