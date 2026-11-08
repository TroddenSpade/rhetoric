import { ICON_DOT, R_PATH, R_TRANSFORM } from './logo-paths.js'

// The app icon mark: the Parisienne R, with a cobalt full stop at the end of
// its swash. The same drawing is used for the installable PWA icon, the
// favicon, the about seal and the CTA mark.
export default function Logo({ size = 38, className = '', label = 'Rhetoric' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 512 512"
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={R_TRANSFORM}>
        <path d={R_PATH} fill="currentColor" />
      </g>
      <circle
        cx={ICON_DOT.cx}
        cy={ICON_DOT.cy}
        r={ICON_DOT.r}
        fill="var(--logo-nib, var(--cobalt))"
      />
    </svg>
  )
}
