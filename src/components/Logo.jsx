// The Rhetoric seal: a serif R inside a laurel ring, with a quill stroke.
export default function Logo({ size = 38, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Rhetoric"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
      <circle cx="32" cy="32" r="25.5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />

      {/* laurel leaves */}
      <g fill="currentColor" opacity="0.7">
        <path d="M18 20c2.8 3.6 4.2 8 3.7 13.2-2.2-2.6-3.8-5.3-4.3-8-.4-2.1 0-4 0.6-5.2Z" />
        <path d="M14 26c2.7 2.8 4.6 6.5 5.1 11-2.4-2.2-4.2-4.6-5-7.1-.6-1.8-.5-3.3-.1-3.9Z" />
        <path d="M46 20c-2.8 3.6-4.2 8-3.7 13.2 2.2-2.6 3.8-5.3 4.3-8 .4-2.1 0-4-.6-5.2Z" />
        <path d="M50 26c-2.7 2.8-4.6 6.5-5.1 11 2.4-2.2 4.2-4.6 5-7.1.6-1.8.5-3.3.1-3.9Z" />
      </g>

      {/* quill nib rising from the R */}
      <path
        d="M44 13c-4.5 2.7-8 6.6-10.2 11.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path d="M43.6 13.2 47.8 9.4c.5 3.1-.4 5.7-2.5 7.6-.9.8-2 .2-1.7-1Z" fill="currentColor" opacity="0.85" />

      <text
        x="31"
        y="45"
        textAnchor="middle"
        fontFamily="'Fraunces', Georgia, 'Times New Roman', serif"
        fontSize="31"
        fontWeight="700"
        fill="currentColor"
      >
        R
      </text>
    </svg>
  )
}
