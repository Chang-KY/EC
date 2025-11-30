import {useState, useCallback} from 'react';

export function useListFilter<T extends string>(initial: T, onChange?: (v: T) => void) {
  const [value, setValue] = useState<T>(initial);
  const set = useCallback(
    (v: T) => {
      setValue(v);
      onChange?.(v);
    },
    [onChange],
  );
  return {value, set};
}
