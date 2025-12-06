'use client'

import Form from 'next/form'
import React, { useActionState } from 'react'
import FormInput from '@/components/form/FormInput'
import { loginAction } from '@/features/(public)/login/actions'
import { initialLoginState } from '@/features/(public)/login/schema'
import clsx from 'clsx'
import { LoaderCircle } from 'lucide-react'

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(loginAction, initialLoginState)

  return (
    <Form action={formAction}>
      <div className="relative flex flex-col gap-3 rounded border border-gray-300 p-7 dark:border-gray-800">
        <span className="absolute top-0 right-0 rounded-bl bg-gray-300 px-5 py-0.5 text-xs font-bold text-black dark:bg-gray-800 dark:text-white">
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
          className={clsx(
            'h-14 w-full cursor-pointer rounded border text-lg font-bold transition-colors',
            'dark:border-gray-800 dark:hover:bg-black dark:hover:text-white',
            'border-gray-300 text-gray-700 hover:bg-gray-200',
          )}
        >
          <p className="flex items-center justify-center gap-3">
            {isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </p>
        </button>
      </div>
    </Form>
  )
}

export default LoginForm
