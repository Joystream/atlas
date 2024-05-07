import { useEffect, useState } from 'react'

export function useDebounceValue<T, R extends boolean = false>(
  value: T,
  delay?: number,
  emptyInitialValue?: R
): R extends true ? T | null : T {
  type ReturnType = R extends true ? T | null : T
  // Initialize the state with appropriate type
  const [debouncedValue, setDebouncedValue] = useState<R extends true ? T | null : T>(
    emptyInitialValue ? (null as ReturnType) : (value as ReturnType)
  )

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value as ReturnType), delay ?? 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  // TypeScript will infer the return type based on the value of emptyInitialValue
  return debouncedValue
}
