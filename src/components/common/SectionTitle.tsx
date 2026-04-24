// packages
import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  highlightedText?: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, highlightedText, className = '' }) => {
  return (
    <h2 className={`font-space-mono font-bold text-6xl md:text-[64px] tracking-[-0.96px] leading-none text-portfolio-dark-700 ${className}`}>
      {typeof children === 'string' && highlightedText ? (
        <>
          {children.split(highlightedText)[0]}
          <span className="text-principal">{highlightedText}</span>
          {children.split(highlightedText)[1]}
        </>
      ) : (
        children
      )}
    </h2>
  );
};

export default SectionTitle;
