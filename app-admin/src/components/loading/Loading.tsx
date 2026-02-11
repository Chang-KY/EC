import React from 'react'
import { LoaderCircle } from 'lucide-react'
import clsx from 'clsx'

export default function Loading({
  heightCN,
  widthCN,
  mention,
}: {
  heightCN?: string
  widthCN?: string
  mention?: string
}) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-2.5 text-gray-700',
        widthCN ? widthCN : '',
        heightCN ? heightCN : '',
      )}
    >
      <LoaderCircle size={34} className="animate-spin" />
      {mention && <p className="text-xs">{mention}</p>}
    </div>
  )
}
