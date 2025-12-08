'use client'

import React from 'react'
import { useActionState } from 'react'
import clsx from 'clsx'
import Form from 'next/form'

type ServerFormProps<State> = {
  action: (prevState: Awaited<State>, formData: FormData) => State | Promise<State>
  initialState: Awaited<State>
  children: (params: { state: State; isPending: boolean }) => React.ReactNode
  className?: string
}

export default function ServerForm<State>(props: ServerFormProps<State>) {
  const { action, initialState, children, className } = props
  const [state, formAction, isPending] = useActionState<State, FormData>(action, initialState)

  return (
    <Form
      action={formAction}
      className={clsx(
        className
          ? className
          : 'grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]',
      )}
    >
      {children({ state, isPending })}
    </Form>
  )
}
