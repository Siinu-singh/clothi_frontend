import React from 'react';

export default function HeartIcon({ 
  size = 24, 
  strokeWidth = 1.5, 
  fill = 'none', 
  stroke = 'currentColor', 
  className = '', 
  style = {}, 
  ...props 
}) {
  // If strokeWidth is passed in Lucide space (e.g., 1.5 or 2), 
  // map it to powerlook's optimized stroke space (around 2 to 2.8)
  const baseStrokeWidth = strokeWidth <= 3 ? (strokeWidth * 1.5) : strokeWidth;

  return (
    <svg
      viewBox="-3 -3 70 70"
      width={size}
      height={size}
      stroke={stroke}
      strokeWidth={baseStrokeWidth}
      fill={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      {...props}
    >
      <path d="M32.012,59.616c-1.119-.521-2.365-1.141-3.707-1.859a79.264,79.264,0,0,1-11.694-7.614C6.316,42,.266,32.6.254,22.076,0.244,12.358,7.871,4.506,17.232,4.5a16.661,16.661,0,0,1,11.891,4.99l2.837,2.889,2.827-2.9a16.639,16.639,0,0,1,11.874-5.02h0c9.368-.01,17.008,7.815,17.021,17.539,0.015,10.533-6.022,19.96-16.312,28.128a79.314,79.314,0,0,1-11.661,7.63C34.369,58.472,33.127,59.094,32.012,59.616Z" />
    </svg>
  );
}
