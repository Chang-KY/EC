'use client'

import React, { useState } from 'react'
import { Map } from 'lucide-react'
import Modal from '@/components/modal/Modal'
import CategoryPyramidD3 from '@/features/(authenticated)/commerce/categories/components/tree/CategoryPyramid'

export default function MapButton({ categoryId , currentId}: { categoryId: number, currentId: number }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Map
        size={16}
        className="cursor-pointer hover:opacity-80"
        role="button"
        onClick={() => setIsOpen(true)}
      />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CategoryPyramidD3
          categoryId={categoryId}
          onClose={() => setIsOpen(false)}
          currentId={currentId}
        />
      </Modal>
    </>
  )
}
