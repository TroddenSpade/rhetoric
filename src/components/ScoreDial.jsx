export default function ScoreDial({ value = 0, label = 'Clarity', size = 94 }) {
  const stroke = 5
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const percent = Math.max(0, Math.min(100, Number(value) || 0))
  const offset = circumference * (1 - percent / 100)

  const color =
    percent >= 75 ? 'var(--ok)' : percent >= 55 ? 'var(--gold)' : 'var(--bad)'

  return (
    <div
      className="score-dial"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${percent} out of 100`}
    >
      <svg width={size} height={size} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--line-soft)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="score-dial__text">
        <span className="score-dial__value">{percent}</span>
        <span className="score-dial__label">{label}</span>
      </div>
    </div>
  )
}
