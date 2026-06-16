// packages
import type { CSSProperties, ElementType, ReactNode } from 'react';

// hooks
import { useInView } from '../../hooks/useInView';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
  as?: ElementType;
  className?: string;
  href?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
}

export const Reveal = ({
  children,
  delay = 0,
  style,
  as: As = 'div',
  className,
  href,
  onMouseEnter,
  onMouseLeave,
}: RevealProps): React.ReactElement => {
  const [ref, seen] = useInView<HTMLElement>();

  const Component = As as ElementType;

  return (
    <Component
      ref={ref}
      href={href}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 600ms cubic-bezier(.2,.7,.2,1) ${delay}ms, transform 600ms cubic-bezier(.2,.7,.2,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </Component>
  );
};
