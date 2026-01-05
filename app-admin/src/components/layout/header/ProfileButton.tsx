'use client'

import React from 'react'
import {
  DropdownElement,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu/DropdownElement'
import { Avatar } from '@/components/ui/Avatar'
import { logoutAction } from '@/features/layout/auth/logout/actions'
import DropdownMenu from '@/components/ui/DropdownMenu/DropdownMenu'
import DropdownButton from '@/components/ui/DropdownButton'

const ProfileButton = () => {
  const handleLogOut = async () => {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
      await logoutAction()
      alert('성공적으로 로그아웃 되었습니다.')
    }
  }

  return (
    <DropdownMenu
      label="My Account"
      triggerButton={<Avatar size="xs" ring="default" src="" alt="장권영" fallback="권영" />}
      menuElement={[
        { id: 'setting', element: <DropdownButton onClick={handleLogOut} label="Setting" /> },
        {
          id: 'logout',
          element: <DropdownButton onClick={handleLogOut} label="Logout" />,
        },
      ]}
    />
  )
}

export default ProfileButton
