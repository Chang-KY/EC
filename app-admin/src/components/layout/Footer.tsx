import React from 'react'

export default async function Footer() {
  return (
    <footer className="fixed bottom-0 z-[50] h-3 w-full border-t border-gray-300 bg-white pr-1 text-right text-[8px] text-black dark:border-gray-800 dark:bg-black dark:text-white">
      © {new Date().getFullYear()} 장권영. All rights reserved.
    </footer>
  )
}
