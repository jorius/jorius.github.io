// packages
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center justify-center px-8 py-4 bg-portfolio-gray-100 rounded-none font-inter text-xl text-black ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
