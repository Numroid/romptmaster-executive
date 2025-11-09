import React from 'react'

const SkillRadarChart = ({ skills, size = 300 }) => {
  // Skills should be an object like:
  // { clarity: 85, context: 75, specificity: 90, format: 70, businessValue: 80, innovation: 65 }

  const skillArray = Object.entries(skills).map(([name, value]) => ({
    name: formatSkillName(name),
    value: Math.min(100, Math.max(0, value))
  }))

  const numSkills = skillArray.length
  const centerX = size / 2
  const centerY = size / 2
  const maxRadius = (size / 2) - 40
  const angleStep = (2 * Math.PI) / numSkills

  // Calculate polygon points for the skill values
  const skillPoints = skillArray.map((skill, index) => {
    const angle = (index * angleStep) - (Math.PI / 2) // Start from top
    const radius = (skill.value / 100) * maxRadius
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    return { x, y, skill }
  })

  // Calculate axis points (100% values)
  const axisPoints = skillArray.map((skill, index) => {
    const angle = (index * angleStep) - (Math.PI / 2)
    const x = centerX + maxRadius * Math.cos(angle)
    const y = centerY + maxRadius * Math.sin(angle)
    return { x, y, skill }
  })

  // Calculate label positions (slightly beyond 100%)
  const labelPoints = skillArray.map((skill, index) => {
    const angle = (index * angleStep) - (Math.PI / 2)
    const labelRadius = maxRadius + 30
    const x = centerX + labelRadius * Math.cos(angle)
    const y = centerY + labelRadius * Math.sin(angle)
    return { x, y, skill, angle }
  })

  // Create polygon path for skill values
  const skillPolygon = skillPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z'

  // Create reference circle paths (25%, 50%, 75%, 100%)
  const referenceCircles = [25, 50, 75, 100].map(percent => {
    const radius = (percent / 100) * maxRadius
    const points = Array.from({ length: numSkills }, (_, i) => {
      const angle = (i * angleStep) - (Math.PI / 2)
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      return { x, y }
    })
    return {
      percent,
      path: points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z'
    }
  })

  return (
    <div className="skill-radar-chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Reference circles */}
        {referenceCircles.map(circle => (
          <path
            key={circle.percent}
            d={circle.path}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="1"
            opacity={circle.percent === 100 ? 0.4 : 0.2}
          />
        ))}

        {/* Axis lines */}
        {axisPoints.map((point, index) => (
          <line
            key={`axis-${index}`}
            x1={centerX}
            y1={centerY}
            x2={point.x}
            y2={point.y}
            stroke="var(--border-color)"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}

        {/* Skill value polygon */}
        <path
          d={skillPolygon}
          fill="url(#skillGradient)"
          fillOpacity="0.5"
          stroke="var(--orange-500)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Skill value points */}
        {skillPoints.map((point, index) => (
          <g key={`point-${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="var(--orange-500)"
              stroke="var(--bg-primary)"
              strokeWidth="2"
            />
          </g>
        ))}

        {/* Skill labels */}
        {labelPoints.map((point, index) => {
          // Adjust text anchor based on position
          let textAnchor = 'middle'
          if (point.x < centerX - 10) textAnchor = 'end'
          if (point.x > centerX + 10) textAnchor = 'start'

          return (
            <g key={`label-${index}`}>
              <text
                x={point.x}
                y={point.y}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="skill-label"
              >
                {point.skill.name}
              </text>
              <text
                x={point.x}
                y={point.y + 14}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="skill-value"
              >
                {point.skill.value}%
              </text>
            </g>
          )
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--orange-500)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--teal-500)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>

      <style jsx>{`
        .skill-radar-chart {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .skill-label {
          font-size: 12px;
          font-weight: var(--font-semibold);
          fill: var(--text-primary);
        }

        .skill-value {
          font-size: 11px;
          font-weight: var(--font-medium);
          fill: var(--orange-400);
        }

        @media (max-width: 768px) {
          .skill-label {
            font-size: 10px;
          }

          .skill-value {
            font-size: 9px;
          }
        }
      `}</style>
    </div>
  )
}

function formatSkillName(name) {
  // Convert camelCase to Title Case
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

export default SkillRadarChart
