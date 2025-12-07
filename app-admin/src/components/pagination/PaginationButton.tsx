import React from 'react'
import clsx from 'clsx'

interface PaginationButtonProps {
  onClick: () => void
  disabled: boolean
  contents: string
  ariaLabel: string
}

const PaginationButton = (props: PaginationButtonProps) => {
  const { onClick, disabled, contents, ariaLabel } = props
  return (
    <button
      className={clsx(
        'inline-flex size-7 items-center justify-center rounded border border-gray-300 bg-gray-200 text-xl text-black disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-700',
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {contents}
    </button>
  )
}

export default PaginationButton
