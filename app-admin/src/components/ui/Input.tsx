import clsx from 'clsx'
import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string
  information?: string
  icon?: React.ReactNode
}

export default function Input(props: InputProps) {
  const { className, icon, information, type, ...rest } = props
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const openDateTimePicker = () => {
    const el = inputRef.current
    if (!el) return

    el.focus()

    // Chromium 계열 등: native picker 강제 오픈
    el.showPicker?.()

    // showPicker 미지원 브라우저 fallback
    // (일부 브라우저는 click/focus만으로도 picker 열림)
    el.click()
  }

  const isDateTime = type === 'datetime-local'

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type={type}
        {...rest}
        className={clsx(
          'h-9 max-h-10 min-h-7 w-full rounded border py-2 pr-3 text-sm ring-0 outline-none',
          'dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-gray-500',
          'border-gray-300 bg-white pl-3 text-gray-700 focus:border-indigo-200 focus:ring-1 focus:ring-indigo-200',
          icon ? 'pr-8' : '',
          className,
        )}
      />

      {information && <div className="absolute right-1 bottom-0 text-xs">{information}</div>}

      {icon && (
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-600"
          onMouseDown={(e) => {
            // 아이콘 클릭이 input blur를 유발하는 경우 방지
            if (isDateTime) e.preventDefault()
          }}
          onClick={() => {
            if (isDateTime) openDateTimePicker()
          }}
          aria-label={isDateTime ? '날짜/시간 선택기 열기' : 'input action'}
        >
          {icon}
        </button>
      )}
    </div>
  )
}
