'use client';

import { ChartLine } from 'phosphor-react';

export function EmptyChart() {
  const W = 500;
  const H = 160;
  const pad = { top: 10, right: 10, bottom: 24, left: 36 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const xStep  = innerW / (months.length - 1);
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="relative w-full">
      {/* Skeleton chart grid */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full opacity-30" style={{ minWidth: 280 }}>
        <g transform={`translate(${pad.left},${pad.top})`}>
          {gridLines.map((t) => {
            const y = innerH * (1 - t);
            return (
              <g key={t}>
                <line x1={0} y1={y} x2={innerW} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                <text x={-8} y={y + 4} textAnchor="end" fontSize={10} fill="#333">
                  {Math.round(100 * t)}
                </text>
              </g>
            );
          })}
          {months.map((m, i) => (
            <text key={m} x={i * xStep} y={innerH + 16} textAnchor="middle" fontSize={10} fill="#333">
              {m}
            </text>
          ))}
        </g>
      </svg>

      {/* Empty state overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
          <ChartLine size={18} className="text-[#333]" />
        </div>
        <p className="text-[#444] text-xs font-medium">No data yet</p>
        <p className="text-[#2a2a2a] text-[11px]">Chart will populate as members join</p>
      </div>
    </div>
  );
}
