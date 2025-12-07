'use client'

import React from 'react'
import { useActionState } from 'react'
import clsx from 'clsx'

type ServerFormProps<TState> = {
  /** 서버 액션 */
  action: (prevState: TState, formData: FormData) => Promise<TState> | TState
  /** 초기 state */
  initialState: TState
  /** 폼 안에 들어갈 실제 UI */
  children: (params: { state: TState; isPending: boolean }) => React.ReactNode
}

export function Form<TState>(props: ServerFormProps<TState>) {
  const { action, initialState, children } = props

  const [state, formAction, isPending] = useActionState(action, initialState)

  return (
    <form
      action={formAction}
      className={clsx('grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]')}
    >
      {children({ state, isPending })}
    </form>
  )
}
