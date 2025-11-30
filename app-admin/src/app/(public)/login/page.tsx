import React from 'react'
import LoginForm from '@/features/(public)/login/components/LoginForm'
import { getCurrentUser } from '@/features/(public)/login/service'
import { redirect } from 'next/navigation'
import { ROUTES } from '@/constants/routes'

const Page = async () => {
  const user = await getCurrentUser()

  if (user) redirect(ROUTES.DASHBOARD)
  return (
    <div className="flex size-full min-h-dvh items-center justify-center">
      <div className="m-auto min-w-96">
        <LoginForm />
      </div>
    </div>
  )
}

export default Page
