import { useCallback, useEffect, useRef, useState } from 'react'

// A tiny persistent-state hook backed by localStorage.
export function useLocalStorage(key, initialValue) {
  const initialRef = useRef(initialValue)
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

  // A fetched account copy writes straight to localStorage and announces the
  // key. Native `storage` events keep a second tab in step as well.
  useEffect(() => {
    const sync = (event) => {
      if (event.type === 'storage' && event.key !== key) return
      if (event.type === 'rhetoric:storage' && event.detail?.key !== key) return
      try {
        const next =
          event.type === 'storage'
            ? event.newValue === null
              ? initialRef.current
              : JSON.parse(event.newValue)
            : event.detail.value
        setValue(next)
      } catch {
        /* a malformed value should not break the page */
      }
    }

    window.addEventListener('storage', sync)
    window.addEventListener('rhetoric:storage', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('rhetoric:storage', sync)
    }
  }, [key])

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
