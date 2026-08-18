import React, { useState } from 'react';

/**
 * Responsive Pure SVG Line Chart for Evolution Metrics
 */
export function EvolutionChart({ 
  data = [], 
  valueKey = 'accuracy', 
  title = 'Evolução', 
  unit = '%',
  color = '#0270c7',
  height = 180,
  minY = 0,
  maxY = 100
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        <p className="text-xs">Ainda não há dados suficientes para exibir o gráfico.</p>
        <p className="text-[11px] text-slate-400 mt-1">Conclui mais sessões para ver a evolução!</p>
      </div>
    );
  }

  const padding = { top: 20, right: 25, bottom: 30, left: 40 };
  const width = 600; // SVG internal coordinate width

  // Determine scale
  const values = data.map(d => Number(d[valueKey]) || 0);
  const actualMin = minY !== undefined ? minY : Math.min(...values, 0);
  const actualMax = maxY !== undefined ? maxY : Math.max(...values, 10);
  const yRange = actualMax - actualMin || 1;

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate coordinates
  const points = data.map((d, i) => {
    const x = data.length === 1 
      ? padding.left + chartWidth / 2 
      : padding.left + (i / (data.length - 1)) * chartWidth;
    const yVal = Number(d[valueKey]) || 0;
    const y = padding.top + chartHeight - ((yVal - actualMin) / yRange) * chartHeight;
    return { ...d, x, y, value: yVal, index: i };
  });

  // SVG Path
  const pathD = points.length === 1
    ? ''
    : points.reduce((acc, pt, i) => {
        return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
      }, '');

  // Fill area under curve
  const areaD = points.length > 1
    ? `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
    : '';

  // Horizontal grid lines (4 levels)
  const gridSteps = 4;
  const gridLines = [];
  for (let i = 0; i <= gridSteps; i++) {
    const val = actualMin + (yRange / gridSteps) * i;
    const y = padding.top + chartHeight - (i / gridSteps) * chartHeight;
    gridLines.push({ val: Math.round(val), y });
  }

  return (
    <div className="w-full relative select-none">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-slate-700 tracking-wide uppercase">{title}</h4>
        {data.length > 0 && (
          <span className="text-xs font-medium text-slate-500">
            Último: <strong className="text-slate-900">{data[data.length - 1][valueKey]}{unit}</strong>
          </span>
        )}
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          style={{ maxHeight: height }}
        >
          <defs>
            <linearGradient id={`grad-${valueKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y Axis Labels */}
          {gridLines.map((line, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={line.y}
                x2={width - padding.right}
                y2={line.y}
                stroke="#e2e8f0"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={line.y + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {line.val}{unit}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          {areaD && (
            <path
              d={areaD}
              fill={`url(#grad-${valueKey})`}
            />
          )}

          {/* Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Points */}
          {points.map((pt, idx) => (
            <g key={idx} className="cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint?.index === idx ? 6 : 4}
                fill="#ffffff"
                stroke={color}
                strokeWidth="2.5"
                className="transition-all duration-150"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}

          {/* X Axis Bottom Label (Sessões) */}
          <text
            x={padding.left}
            y={height - 8}
            textAnchor="start"
            className="text-[10px] fill-slate-400 font-medium"
          >
            Sessão #1
          </text>
          <text
            x={width - padding.right}
            y={height - 8}
            textAnchor="end"
            className="text-[10px] fill-slate-400 font-medium"
          >
            Sessão #{data.length}
          </text>
        </svg>
      </div>

      {/* Floating Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute pointer-events-none bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg -translate-x-1/2 -translate-y-full z-10 whitespace-nowrap font-medium"
          style={{
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: `${(hoveredPoint.y / height) * 100}%`,
            marginTop: '-8px'
          }}
        >
          <div>Sessão #{hoveredPoint.sessionIndex} ({hoveredPoint.date})</div>
          <div className="text-brand-300 font-bold">{hoveredPoint.value}{unit} • {hoveredPoint.questions} q.</div>
        </div>
      )}
    </div>
  );
}
