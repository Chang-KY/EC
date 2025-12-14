'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Avatar } from '@/components/ui/Avatar'
import { logoutAction } from '@/features/layout/auth/logout/actions'

const ProfileButton = () => {
  const handleLogOut = async () => {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
      await logoutAction()
      alert('성공적으로 로그아웃 되었습니다.')
    }
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center">
          <Avatar size="xs" ring="default" src="" alt="장권영" fallback="권영" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Setting</DropdownMenuItem>
          <DropdownMenuItem>
            <button type="button" className="w-full text-left" onClick={handleLogOut}>
              Logout
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ProfileButton
