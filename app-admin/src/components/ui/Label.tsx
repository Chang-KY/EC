import React from 'react'

type LabelProps = {
  name: string
  label: string
}

const Label = (props: LabelProps) => {
  const { name, label } = props

  return (
    <label htmlFor={name} className="ml-0.5 text-lg font-bold">
      {label}
    </label>
  )
}

export default Label
