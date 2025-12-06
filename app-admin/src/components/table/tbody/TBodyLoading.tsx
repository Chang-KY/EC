import { LoaderCircle } from 'lucide-react'

const TBodyLoading = ({ colSpan, height }: { colSpan: number; height: string }) => {
  return (
    <tbody>
      <tr className="">
        <td className="px-3 py-8 text-xs text-gray-500" style={{ height }} colSpan={colSpan}>
          <LoaderCircle className="m-auto size-10 animate-spin text-gray-500 dark:text-gray-200" />
        </td>
      </tr>
    </tbody>
  )
}

export default TBodyLoading
