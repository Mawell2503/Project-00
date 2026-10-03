import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({ children, className = '', padding = 'md' }: CardProps) {
  const paddingMap = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div className={`glass-card ${paddingMap[padding]} ${className}`}>
      {children}
    </div>
  );
}
