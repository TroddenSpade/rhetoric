import { WORDMARK_DOT, WORDMARK_PATH, WORDMARK_VIEWBOX } from './logo-paths.js'

const [, , viewWidth, viewHeight] = WORDMARK_VIEWBOX.split(/\s+/).map(Number)

// The wordmark: “Rhetoric” set in Parisienne, with a cobalt full stop. It is a
// single vector drawing, so the header and footer do not depend on a font load.
export default function Wordmark({ height = 36, className = '', label = 'Rhetoric' }) {
  const width = (height * viewWidth) / viewHeight

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={WORDMARK_VIEWBOX}
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={WORDMARK_PATH} fill="currentColor" />
      <circle
        cx={WORDMARK_DOT.cx}
        cy={WORDMARK_DOT.cy}
        r={WORDMARK_DOT.r}
        fill="var(--wordmark-dot, var(--cobalt))"
      />
    </svg>
  )
}
