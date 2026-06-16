// packages
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-principal text-white border-2 border-principal hover:bg-opacity-90',
  secondary: 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-portfolio-dark-900',
  outline: 'bg-transparent text-portfolio-dark-900 border-2 border-portfolio-dark-900 hover:bg-portfolio-dark-900 hover:text-white',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-5 py-2 text-sm tracking-[-0.21px]',
  md: 'px-10 py-5 text-xl tracking-[-0.3px]',
  lg: 'px-14 py-6 text-2xl tracking-[-0.36px]',
};

const BASE = 'inline-flex items-center justify-center gap-2 font-space-mono font-bold rounded-none transition-all duration-300 hover:scale-105 active:scale-95';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
  icon,
}: ButtonProps): React.ReactElement => {
  const classes = `${BASE} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
      {icon}
    </button>
  );
};

export default Button;
