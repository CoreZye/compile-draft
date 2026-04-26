import './BorderBox.css';

import React, { type ReactNode } from 'react';

interface BorderBoxProps {
  children: ReactNode;
  className?: string;
  strokeColor?: string;
  active?: boolean;
  dashGap?: [number, number]; // [dashLength, gapLength]
}

const BorderBox: React.FC<BorderBoxProps> = ({ 
  children, 
  className = '', 
  strokeColor = '#3498db',
  dashGap = [8, 4],
  active = true
}) => {
  const [dash, gap] = dashGap;
  const offsetSum = dash + gap;

  return (
    <div className={`dash-container ${className}`}>
      <svg className="dash-svg" preserveAspectRatio="none">
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          className={`dash-rect ${active ? 'active' : ''}`}
          style={{
            stroke: strokeColor,
            strokeDasharray: `${dash}, ${gap}`,
            // We pass the sum to a CSS variable for the animation to stay in sync
            // @ts-ignore: Custom CSS variable
            '--dash-offset-sum': offsetSum
          } as React.CSSProperties}
        />
      </svg>
      <div className="dash-content">
        {children}
      </div>
    </div>
  );
};

export default BorderBox;