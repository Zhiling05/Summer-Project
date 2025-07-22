// src/components/NHSArrowIcon.tsx
import React from 'react';

interface ArrowIcon {
  size?: number;
  className?: string;
}

const NHSArrowIcon: React.FC<ArrowIcon> = ({ 
  size = 30, 
  className = "" 
}) => {
  return (
    <div 
      className={`arrow-icon ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none"
        style={{
          display: 'block',
        }}
      >
        {/* 绿色圆形 */}
        <circle 
          cx="20" 
          cy="20" 
          r="20" 
          fill="#009639"
        />
        {/* 白色箭头 */}
        <path 
          d="M0 20h30M20 10l10 10-10 10" 
          stroke="white" 
          strokeWidth="4.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ArrowIcon;