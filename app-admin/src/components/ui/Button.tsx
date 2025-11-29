import React from 'react'

type ButtonProps = {
  children: React.ReactNode
}

const Button = (props: ButtonProps) => {
  const { children, ...rest } = props

  return <button>{children}</button>
}

export default Button
