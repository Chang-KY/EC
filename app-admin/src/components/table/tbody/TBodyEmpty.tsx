import React from 'react';

const TBodyEmpty = ({colSpan, emptyText}: { colSpan: number; emptyText: string }) => {
  return (
    <tbody>
    <tr className="size-full">
      <td className="min-h-screen py-10 w-full text-center text-gray-400" colSpan={colSpan}>
        {emptyText}
      </td>
    </tr>
    </tbody>
  );
};

export default TBodyEmpty;
