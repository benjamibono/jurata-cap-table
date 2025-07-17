'use client';

import React from 'react';
import { Shareholder } from '../types';

interface PieChartProps {
  shareholders: Shareholder[];
  size?: number;
  className?: string;
}

interface ChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const COLORS = [
  '#3C5074',
  '#A6B2C9',
  '#52525B',
  '#6366f1',
  '#8b5cf6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#f97316'
];

export const PieChart: React.FC<PieChartProps> = ({ 
  shareholders, 
  size = 200, 
  className = "" 
}) => {
  const totalShares = shareholders.reduce((sum, shareholder) => sum + shareholder.shares, 0);
  
  if (totalShares === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">No data</p>
        </div>
      </div>
    );
  }

  const data: ChartData[] = shareholders.map((shareholder, index) => ({
    name: shareholder.name,
    value: shareholder.shares,
    percentage: (shareholder.shares / totalShares) * 100,
    color: COLORS[index % COLORS.length]
  }));

  const outerRadius = size / 2 - 20;
  const innerRadius = outerRadius * 0.6; // Create hollow center (60% of outer radius)
  const center = size / 2;
  
  let cumulativePercentage = 0;
  
  const createDoughnutPath = (percentage: number, startAngle: number): string => {
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    
    // Outer arc points
    const x1Outer = center + outerRadius * Math.cos((startAngle * Math.PI) / 180);
    const y1Outer = center + outerRadius * Math.sin((startAngle * Math.PI) / 180);
    const x2Outer = center + outerRadius * Math.cos((endAngle * Math.PI) / 180);
    const y2Outer = center + outerRadius * Math.sin((endAngle * Math.PI) / 180);
    
    // Inner arc points
    const x1Inner = center + innerRadius * Math.cos((startAngle * Math.PI) / 180);
    const y1Inner = center + innerRadius * Math.sin((startAngle * Math.PI) / 180);
    const x2Inner = center + innerRadius * Math.cos((endAngle * Math.PI) / 180);
    const y2Inner = center + innerRadius * Math.sin((endAngle * Math.PI) / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    return `
      M ${x1Outer} ${y1Outer}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}
      L ${x2Inner} ${y2Inner}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}
      Z
    `;
  };

  return (
    <div className={`flex flex-col md:flex-row items-center md:items-center gap-8 ${className}`}>
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const startAngle = (cumulativePercentage / 100) * 360;
            const path = createDoughnutPath(item.percentage, startAngle);
            cumulativePercentage += item.percentage;
            
            return (
              <path
                key={index}
                d={path}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {/* Center text for total - now fits naturally in hollow center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {totalShares.toLocaleString()}
            </div>
            <div className="text-xs text-secondary">Total Shares</div>
          </div>
        </div>
      </div>
      
      {/* Legend - centered on medium/large screens */}
      <div className="flex-1 flex items-center justify-center md:justify-start">
        <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm px-4 py-2">
              <div className="flex items-center space-x-3 min-w-0">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700 font-medium truncate">{item.name}</span>
              </div>
              <div className="flex items-center space-x-4 flex-shrink-0">
                <span className="text-primary font-semibold">
                  {item.value.toLocaleString()}
                </span>
                <span className="text-secondary font-semibold">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
          {data.length > 5 && (
            <div className="flex items-center justify-between text-sm px-4 py-2">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-gray-300 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Others ({data.length - 5})</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-primary font-semibold">
                  {data.slice(5).reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </span>
                <span className="text-secondary font-semibold">
                  {data.slice(5).reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 