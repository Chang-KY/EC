'use client'

import Input from '@/components/ui/Input'
import { Loader2, Search } from 'lucide-react'
import React from 'react'

type SearchBarProps = {
  keyword: string | undefined
  placeholder: string
  isSearching: boolean
  flush: () => void
  setKeyword: React.Dispatch<React.SetStateAction<string | undefined>>
  searchLabel: string
}

export default function SearchBar(props: SearchBarProps) {
  const { keyword, placeholder, isSearching, flush, setKeyword, searchLabel } = props
  return (
    <div className="flex w-[289px] min-w-[289px] items-center gap-2">
      <Input
        type="text"
        name="search"
        className="h-7"
        value={keyword}
        placeholder={placeholder}
        icon={isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        onKeyDown={(e) => {
          if (e.key === 'Enter') flush()
        }}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <span className="min-w-20 text-xs text-gray-500">{isSearching && searchLabel}</span>
    </div>
  )
}
