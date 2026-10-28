import React, { useState } from 'react';

export default function ActivityChart({ data = [], streak = 9, weeklyXp = 3450 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '24px 0', textAlign: 'center' }}>
        No telemetry recorded for this cycle.
      </div>
    );
  }

  const maxXp = Math.max(...data.map(d => d.xp || 100), 1000);
  const chartHeight = 110;

  return (
    <div style={{ width: '100%' }}>
      {/* Metrics Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span className="label-caps">7-DAY TELEMETRY</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span className="mono-num" style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)' }}>
              +{weeklyXp.toLocaleString()}
            </span>
            <span className="label-caps" style={{ color: 'var(--accent-primary)' }}>XP EARNED</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="label-caps">UNBROKEN DISCIPLINE</span>
          <div className="mono-num" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--accent-rare)', marginTop: '4px' }}>
            {streak} DAYS ACTIVE
          </div>
        </div>
      </div>

      {/* Clean Custom SVG Bar Graph */}
      <div style={{ position: 'relative', width: '100%', height: `${chartHeight + 30}px` }}>
        <svg
          width="100%"
          height={chartHeight + 30}
          viewBox={`0 0 ${data.length * 50} ${chartHeight + 30}`}
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="barGradActive" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="barGradHover" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="1" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Baseline Subtle Rule */}
          <line
            x1="0"
            y1={chartHeight}
            x2={data.length * 50}
            y2={chartHeight}
            stroke="#292A35"
            strokeWidth="1"
          />

          {data.map((item, index) => {
            const barHeight = Math.max(8, (item.xp / maxXp) * (chartHeight - 16));
            const x = index * 50 + 14;
            const y = chartHeight - barHeight;
            const isHovered = hoveredIndex === index;

            return (
              <g 
                key={index} 
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Background column hover zone */}
                <rect
                  x={index * 50 + 4}
                  y="0"
                  width="42"
                  height={chartHeight}
                  fill={isHovered ? 'rgba(255, 255, 255, 0.03)' : 'transparent'}
                  rx="4"
                />

                {/* Vertical Bar */}
                <rect
                  x={x}
                  y={y}
                  width="22"
                  height={barHeight}
                  fill={isHovered ? 'url(#barGradHover)' : 'url(#barGradActive)'}
                  rx="3"
                  style={{
                    transition: 'all 200ms ease',
                    filter: isHovered ? 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.6))' : 'none'
                  }}
                />

                {/* Day label */}
                <text
                  x={x + 11}
                  y={chartHeight + 18}
                  textAnchor="middle"
                  fill={isHovered ? '#F4F2FA' : '#696978'}
                  fontFamily="var(--font-mono)"
                  fontSize="10"
                  fontWeight={isHovered ? '700' : '400'}
                >
                  {item.day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Popup */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            style={{
              position: 'absolute',
              top: '-36px',
              left: `${((hoveredIndex + 0.5) / data.length) * 100}%`,
              transform: 'translateX(-50%)',
              backgroundColor: '#1C1D29',
              border: '1px solid var(--accent-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 10px',
              pointerEvents: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
              whiteSpace: 'nowrap',
              zIndex: 10
            }}
          >
            <div className="mono-num" style={{ fontSize: '11px', color: '#F4F2FA', fontWeight: 600 }}>
              {data[hoveredIndex].xp} XP // {data[hoveredIndex].quests || 1} missions
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
