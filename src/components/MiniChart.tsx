import React from 'react';

interface MiniChartProps {
  data: number[];
  color: string;
  height?: number;
  width?: string;
}

const MiniChart: React.FC<MiniChartProps> = ({ 
  data, 
  color, 
  height = 40, 
  width = '100%' 
}) => {
  if (!data || data.length === 0) {
    return <div style={{ height, width }} className="bg-gray-100 rounded"></div>;
  }

  // Calculate the chart dimensions
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // Avoid division by zero
  
  // Generate path points
  const points: string[] = [];
  const step = 100 / (data.length - 1 || 1);
  
  data.forEach((value, index) => {
    const x = index * step;
    // Normalize the y-value to a percentage of the height (inverted, as SVG y-axis goes top to bottom)
    const y = 100 - ((value - min) / range) * 100;
    points.push(`${x},${y}`);
  });
  
  const pathData = `M${points.join(' L')}`;
  
  // Convert CSS variable syntax to actual color value
  const resolveColor = (colorValue: string): string => {
    if (colorValue.startsWith('var(--')) {
      if (colorValue === 'var(--success)') return '#36B37E';
      if (colorValue === 'var(--danger)') return '#FF5630';
      if (colorValue === 'var(--purple-primary)') return '#6d28d9';
      if (colorValue === 'var(--purple-medium)') return '#5b21b6';
      if (colorValue === 'var(--purple-dark)') return '#4c1d95';
      if (colorValue === 'var(--purple-light)') return '#8b5cf6';
      return '#000000'; // Default fallback
    }
    return colorValue;
  };
  
  const resolvedColor = resolveColor(color);
  const gradientId = `gradient-${resolvedColor.replace(/[^a-zA-Z0-9]/g, '')}`;
  
  return (
    <div style={{ height, width }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Chart line */}
        <path
          d={pathData}
          fill="none"
          stroke={resolvedColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Area under the line with gradient */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={resolvedColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={resolvedColor} stopOpacity="0" />
        </linearGradient>
        <path
          d={`${pathData} L100,100 L0,100 Z`}
          fill={`url(#${gradientId})`}
        />
      </svg>
    </div>
  );
};

export default MiniChart; 