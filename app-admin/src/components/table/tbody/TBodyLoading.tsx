const TBodyLoading = ({ colSpan }: { colSpan: number }) => {
  return (
    <tbody>
      <tr className="">
        <td className="px-3 py-8 text-center text-gray-500" colSpan={colSpan}>
          데이터를 불러오고 있습니다.
        </td>
      </tr>
    </tbody>
  )
}

export default TBodyLoading
