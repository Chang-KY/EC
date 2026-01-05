import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }

export default function DropdownButton({ label, onClick, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className="h-full w-full px-2 py-1.5 text-left text-gray-700"
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  )
}
