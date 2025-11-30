'use client'

import React from 'react'
import './Button.css'

type ButtonProps = {
  children: React.ReactNode
}

const Button = (props: ButtonProps) => {
  const { children, ...rest } = props

  return (
    <button {...rest} className="btn-primary">
      {children}
    </button>
  )
}

export default Button
