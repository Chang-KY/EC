import React from 'react';
import {flexRender, Table} from '@tanstack/react-table';
import clsx from 'clsx';

type THeadProps<TData> = {
  table: Table<TData>;
};

function THeadInner<TData>({table}: THeadProps<TData>) {
  return (
    <thead className="sticky top-0 z-10 bg-gray-900">
    {table.getHeaderGroups().map((hg) => (
      <tr key={hg.id}>
        {hg.headers.map((h, index) => {
          const isSortable = h.column.getCanSort();
          const sorted = h.column.getIsSorted();
          return (
            <th
              key={h.id}
              colSpan={h.colSpan}
              className={clsx(
                `min-w-[4rem] px-3 py-2 text-center border-t border-b border-gray-800 font-semibold whitespace-nowrap text-gray-200`,
                isSortable && 'cursor-pointer select-none',
                index === 0 ? 'rounded-tl rounded-bl border-l' : '',
                index === hg.headers.length - 1 ? 'rounded-tr rounded-br border-r' : '',
              )}
              onClick={isSortable ? h.column.getToggleSortingHandler() : undefined}
            >
              <div className="flex items-center justify-center gap-1">
                {flexRender(h.column.columnDef.header, h.getContext())}
                {sorted === 'asc' && <span>▲</span>}
                {sorted === 'desc' && <span>▼</span>}
              </div>
            </th>
          );
        })}
      </tr>
    ))}
    </thead>
  );
}

const THead = React.memo(THeadInner) as <TData>(p: THeadProps<TData>) => React.JSX.Element;
export default THead;
