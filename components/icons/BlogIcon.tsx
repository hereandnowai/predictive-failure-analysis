
import React from 'react';

interface IconProps {
  className?: string;
}

export const BlogIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m0 0A7.493 7.493 0 0019.5 12C19.5 8.28 16.22 5.25 12.5 5.25S5.5 8.28 5.5 12a7.493 7.493 0 007.5 5.747M12 6.253L12 3m0 3.253l4.833-2.08M12 6.253L7.167 4.173" />
  </svg>
);