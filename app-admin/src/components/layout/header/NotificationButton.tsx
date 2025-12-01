'use client'

import React from 'react'
import { Bell } from 'lucide-react'

const NotificationButton = () => {
  return (
    <button className="hidden rounded-full p-2 hover:bg-white/5 sm:inline-flex">
      <Bell className="size-4" />
    </button>
  )
}

export default NotificationButton
