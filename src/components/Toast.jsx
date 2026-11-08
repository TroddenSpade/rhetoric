import { useEffect, useRef } from 'react'

export default function Toast({ message, onDone }) {
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  // Depend on the message only: a parent re-render (a keystroke, a new
  // analysis) should not restart the dismissal timer.
  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => onDoneRef.current?.(), 2800)
    return () => window.clearTimeout(timer)
  }, [message])

  if (!message) return null

  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  )
}
