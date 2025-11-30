'use client'

import Form from 'next/form'
import React, { useActionState } from 'react'
import FormInput from '@/components/form/FormInput'
import { loginAction } from '@/features/(public)/login/actions'
import { initialLoginState } from '@/features/(public)/login/schema'

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(loginAction, initialLoginState)

  return (
    <Form action={formAction}>
      <div className="relative flex flex-col gap-3 rounded border p-7 dark:border-gray-800">
        <span className="absolute top-0 right-0 rounded-bl px-2 py-0.5 text-xs font-bold text-white dark:bg-gray-800">
          EC
        </span>
        <FormInput
          label="E-Mail"
          name="email"
          type="email"
          defaultValue={state.values?.email ?? ''}
          errorMessage={state.fieldErrors?.email?.[0]}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          errorMessage={state.fieldErrors?.password?.[0] ?? state.message}
        />
      </div>

      <div className="mt-3 w-full">
        <button
          disabled={isPending}
          type="submit"
          className="h-14 w-full cursor-pointer rounded border border-black text-lg font-bold transition-colors hover:bg-black hover:text-white dark:border-gray-800"
        >
          {isPending ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </Form>
  )
}

export default LoginForm
