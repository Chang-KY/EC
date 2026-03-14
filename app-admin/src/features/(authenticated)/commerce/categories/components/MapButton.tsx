'use client'

import React, { useState } from 'react'
import { Map } from 'lucide-react'
import Modal from '@/components/modal/Modal'
import CategoryPyramidD3 from '@/features/(authenticated)/commerce/categories/components/tree/CategoryPyramid'
import { iconButtonClassName } from '@/constants/iconButtonClassName'

export default function MapButton({
  categoryId,
  currentId,
}: {
  categoryId: number
  currentId: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button type="button" className={iconButtonClassName} onClick={() => setIsOpen(true)}>
        <Map size={14} />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} custom>
        <CategoryPyramidD3
          categoryId={categoryId}
          onClose={() => setIsOpen(false)}
          currentId={currentId}
        />
      </Modal>
    </>
  )
}
