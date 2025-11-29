import React from 'react'
import Form from 'next/form'

const Page = () => {
  return (
    <div className="flex size-full min-h-dvh items-center justify-center">
      <div className="m-auto min-w-96">
        <Form action="">
          <div className="relative flex flex-col gap-3 rounded border p-7 dark:border-gray-800">
            <span className="absolute top-0 right-0 rounded-bl px-2 py-0.5 text-xs font-bold text-white dark:bg-gray-800">
              EC
            </span>

            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="ml-0.5 text-lg font-bold">
                E-Mail
              </label>
              <input
                name="email"
                type="email"
                autoComplete="username"
                className="rounded border border-gray-800 px-3 py-1.5 focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="ml-0.5 text-lg font-bold">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="rounded border border-gray-800 px-3 py-1.5 focus:border-indigo-600 focus:outline-none"
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="mt-3 w-full">
            <button
              type="submit"
              className="h-14 w-full cursor-pointer rounded border border-black text-lg font-bold transition-colors hover:bg-black hover:text-white dark:border-gray-800"
            >
              Sign in
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Page
