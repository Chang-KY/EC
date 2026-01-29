import React from 'react'
import clsx from 'clsx'
import Label from '@/components/ui/Label'
import Required from '@/components/ui/Required'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Select from '@/components/ui/Select'

export type BaseSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  name: string
  options: { label: React.ReactNode; value: string }[]
  errorMessage?: string
  className?: string
  outerClassName?: string
  placeholder?: string
  selectNoValue?: boolean
}

export default function FormSelect(props: BaseSelectProps) {
  const {
    label,
    errorMessage,
    required,
    name,
    options,
    className,
    outerClassName,
    placeholder,
    selectNoValue,
    ...rest
  } = props

  return (
    <div className={clsx('flex flex-col gap-1', outerClassName)}>
      {label && (
        <div className="flex items-center">
          <Label name={name} label={label} />
          {required && <Required />}
        </div>
      )}
      <Select
        selectNoValue={selectNoValue}
        required={required}
        placeholder={placeholder}
        name={name}
        aria-label={label}
        aria-labelledby={label}
        className={className}
        options={options}
        {...rest}
      />
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  )
}
