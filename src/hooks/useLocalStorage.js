import { useCallback, useEffect, useState } from 'react'

// A tiny persistent-state hook backed by localStorage.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = window.localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable — ignore */
    }
  }, [key, value])

  return [value, setValue]
}

export function useChecklist(key, items) {
  const [checked, setChecked] = useLocalStorage(key, [])

  const toggle = useCallback(
    (name) => {
      setChecked((previous) =>
        previous.includes(name)
          ? previous.filter((item) => item !== name)
          : [...previous, name],
      )
    },
    [setChecked],
  )

  const isChecked = useCallback((name) => checked.includes(name), [checked])
  const reset = useCallback(() => setChecked([]), [setChecked])
  const percent = items.length
    ? Math.round((checked.filter((name) => items.includes(name)).length / items.length) * 100)
    : 0

  return { checked, toggle, isChecked, reset, percent }
}
