import { useState, useEffect } from 'react'

/**
 * Custom hook for debouncing values with TypeScript support
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timeout on value or delay change
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}