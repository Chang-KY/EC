'use client'

import React from 'react'
import './Button.css'
import clsx from 'clsx'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  icon?: React.ReactNode
}

const Button = (props: ButtonProps) => {
  const { children, className, icon, ...rest } = props

  return (
    <button {...rest} className={clsx('btn-add')}>
      {icon && <div>{icon}</div>}
      <span>{children}</span>
    </button>
  )
}

export default Button
