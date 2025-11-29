import React from 'react'

type ErrorMessageProps = {
  errorMessage: string
}

const ErrorMessage = (props: ErrorMessageProps) => {
  const { errorMessage } = props

  return <p className="text-xs text-red-600">{errorMessage}</p>
}

export default ErrorMessage
