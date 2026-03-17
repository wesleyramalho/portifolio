'use client'

const R = 28
const C = 2 * Math.PI * R // ≈ 175.9

interface CircleProgressProps {
  current: number
  total: number
}

export default function CircleProgress({ current, total }: CircleProgressProps) {
  const progress = total > 1 ? current / (total - 1) : 0
  const offset = C * (1 - progress)

  return (
    <div
      className="fixed bottom-8 right-8 z-30 pointer-events-none hidden md:block"
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Section ${current + 1} of ${total}`}
    >
      <svg width={72} height={72} viewBox="0 0 72 72" aria-hidden="true">
        {/* Track ring */}
        <circle
          cx={36}
          cy={36}
          r={R}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={2}
          fill="none"
        />
        {/* Progress ring */}
        <circle
          cx={36}
          cy={36}
          r={R}
          stroke="rgba(255,255,255,0.75)"
          strokeWidth={2}
          fill="none"
          strokeDasharray={C}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}
        />
        {/* Section counter */}
        <text
          x={36}
          y={41}
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontSize={11}
          fontFamily="var(--font-orbitron)"
        >
          {String(current + 1).padStart(2, '0')}
        </text>
      </svg>
    </div>
  )
}
