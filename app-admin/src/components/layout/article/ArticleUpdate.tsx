'use client'

import React from 'react'
import Button from '@/components/ui/Button'
import { useSetAtom } from 'jotai'
import { articleButtonAtom } from '@/store/articleEditAtoms'

export default function ArticleUpdate({
  title,
  children,
  formId,
}: {
  title: string
  formId: string
  children: React.ReactNode
}) {
  const setId = useSetAtom(articleButtonAtom)

  return (
    <div className="relative flex size-full flex-col justify-between p-2">
      <h2 className="absolute top-0 right-0 rounded-tr rounded-bl-md bg-gray-200 px-2 py-1 text-xs">
        {title}
      </h2>
      <div>{children}</div>
      <div className="flex items-center justify-end gap-2.5">
        <Button variant="cancel" onClick={() => setId('')}>
          Cancel
        </Button>
        <Button type="submit" form={formId} variant="update">
          Update
        </Button>
      </div>
    </div>
  )
}
