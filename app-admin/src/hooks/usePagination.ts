import {useCallback, useState} from 'react';

export function usePagination(
  initialPage = 1,
  initialPageSize = 20,
  opts?: {minPageSize?: number; maxPageSize?: number},
) {
  const {minPageSize = 1, maxPageSize = 100} = opts ?? {};
  const [page, setPage] = useState(Math.max(1, initialPage));
  const [pageSize, _setPageSize] = useState(
    Math.min(Math.max(initialPageSize, minPageSize), maxPageSize),
  );

  const setPageSafe = useCallback((p: number) => {
    setPage(Math.max(1, Math.floor(p || 1)));
  }, []);

  const setPageSize = useCallback(
    (n: number, resetPage = true) => {
      const clamped = Math.min(Math.max(Math.floor(n || minPageSize), minPageSize), maxPageSize);
      _setPageSize(clamped);
      if (resetPage) setPage(1);
    },
    [minPageSize, maxPageSize],
  );
  const sizes = [initialPageSize, initialPageSize * 2, initialPageSize * 5, initialPageSize * 10];

  return {page, setPage: setPageSafe, pageSize, setPageSize, sizes};
}
