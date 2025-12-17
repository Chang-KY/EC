import { useEffect, useMemo, useRef, useState } from 'react'

type DebounceOptions = {
  leading?: boolean // 처음 입력에서 즉시 반영
  trailing?: boolean // 마지막 입력 후 delay에 반영(기본 true)
  maxWait?: number // 일정 시간 내 반드시 한 번은 반영
}

export function useDebouncedState<T>(
  initial: T,
  delay: number,
  opts: DebounceOptions = { trailing: true },
) {
  const { leading = false, trailing = true, maxWait } = opts
  const [value, setValue] = useState<T>(initial)
  const [debounced, setDebounced] = useState<T>(initial)

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const maxTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirst = useRef(true)

  const clear = () => {
    if (timer.current) clearTimeout(timer.current)
    if (maxTimer.current) clearTimeout(maxTimer.current)
    timer.current = null
    maxTimer.current = null
  }

  const flush = () => {
    clear()
    setDebounced(value)
  }

  useEffect(() => {
    clear()

    // leading: 첫 변화 즉시 반영 (첫 변화거나 이전 변화로부터 delay가 지났다고 가정)
    if (leading && (isFirst.current || trailing)) {
      setDebounced(value)
    }

    // trailing: delay 후 반영
    if (trailing) {
      timer.current = setTimeout(() => setDebounced(value), delay)
    }

    // maxWait: 특정 시간 안에는 무조건 한 번 반영
    if (typeof maxWait === 'number') {
      maxTimer.current = setTimeout(() => setDebounced(value), maxWait)
    }

    isFirst.current = false
    return clear
  }, [value, delay, leading, trailing, maxWait])

  const isDebouncing = useMemo(() => value !== debounced, [value, debounced])

  return {
    value,
    setValue, // 즉시값 / setter (input에 바인딩)
    debounced, // API 호출/쿼리키에 사용
    isDebouncing, // 로딩 스피너 등 UX 처리에 활용
    cancel: clear, // 예약 취소
    flush, // 지연 없이 즉시 반영
  }
}
