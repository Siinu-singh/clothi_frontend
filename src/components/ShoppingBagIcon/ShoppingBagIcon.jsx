import React from 'react';

export default function ShoppingBagIcon({ 
  size = 24, 
  strokeWidth = 1.5, 
  stroke = 'currentColor', 
  fill = 'none', 
  className = '', 
  style = {}, 
  ...props 
}) {
  // Scale the strokeWidth from Lucide's 24px viewport to our 20px viewport
  const scaledStrokeWidth = (strokeWidth * 20) / 24;

  return (
    <svg
      viewBox="-1 -1 22 22"
      width={size}
      height={size}
      fill={fill}
      stroke={stroke}
      strokeWidth={scaledStrokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      {...props}
    >
      <path d="M6.25 6.39167V5.58334C6.25 3.70834 7.75833 1.86667 9.63333 1.69167C11.8667 1.47501 13.75 3.23334 13.75 5.42501V6.57501" strokeMiterlimit="10" />
      <path d="M7.49998 18.3333H12.5C15.85 18.3333 16.45 16.9917 16.625 15.3583L17.25 10.3583C17.475 8.32501 16.8916 6.66667 13.3333 6.66667H6.66664C3.10831 6.66667 2.52498 8.32501 2.74998 10.3583L3.37498 15.3583C3.54998 16.9917 4.14998 18.3333 7.49998 18.3333Z" strokeMiterlimit="10" />
      <path d="M12.9129 9.99999H12.9204" />
      <path d="M7.07872 9.99999H7.0862" />
    </svg>
  );
}
