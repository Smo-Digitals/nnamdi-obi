'use client';

const data = [
  { month: 'Jan', value: 40 },
  { month: 'Feb', value: 80 },
  { month: 'Mar', value: 120 },
  { month: 'Apr', value: 200 },
  { month: 'May', value: 310 },
  { month: 'Jun', value: 270 },
  { month: 'Jul', value: 380 },
];

export function GrowthChart() {
  const W = 500;
  const H = 160;
  const pad = { top: 10, right: 10, bottom: 24, left: 36 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const max = Math.max(...data.map((d) => d.value));
  const xStep = innerW / (data.length - 1);
  const yScale = (v: number) => innerH - (v / max) * innerH;

  const points = data.map((d, i) => ({ x: i * xStep, y: yScale(d.value) }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x},${innerH} L 0,${innerH} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 280 }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DC5B17" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#DC5B17" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={`translate(${pad.left},${pad.top})`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = innerH * (1 - t);
            const val = Math.round(max * t);
            return (
              <g key={t}>
                <line x1={0} y1={y} x2={innerW} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                <text x={-8} y={y + 4} textAnchor="end" fontSize={10} fill="#555">{val}</text>
              </g>
            );
          })}

          {/* Area */}
          <path d={areaPath} fill="url(#chartGrad)" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="#DC5B17" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={3} fill="#DC5B17" />
          ))}

          {/* X labels */}
          {data.map((d, i) => (
            <text key={i} x={i * xStep} y={innerH + 16} textAnchor="middle" fontSize={10} fill="#555">
              {d.month}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
