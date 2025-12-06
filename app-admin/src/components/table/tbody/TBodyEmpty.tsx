import React from 'react'

const TBodyEmpty = ({
  colSpan,
  emptyText,
  height,
}: {
  colSpan: number
  emptyText: string
  height: string
}) => {
  return (
    <tbody>
      <tr className="size-full">
        <td
          style={{ height }}
          className="min-h-screen w-full py-10 text-center text-xs text-gray-700 dark:text-white"
          colSpan={colSpan}
        >
          {emptyText}
        </td>
      </tr>
    </tbody>
  )
}

export default TBodyEmpty
