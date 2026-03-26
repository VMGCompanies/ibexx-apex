import React from 'react';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'navy' | 'gold' | 'blue' | 'dark' | 'orange';

const variants: Record<Variant, string> = {
  success:  'bg-green-100 text-green-800',
  warning:  'bg-yellow-100 text-yellow-800',
  danger:   'bg-red-100 text-red-800',
  info:     'bg-apex-100 text-apex-800',
  neutral:  'bg-slate-100 text-slate-600',
  navy:     'bg-apex-100 text-apex-900',
  gold:     'bg-brand-100 text-brand-700',
  blue:     'bg-apex-100 text-apex-800',     // alias → navy
  dark:     'bg-apex-900 text-white',
  orange:   'bg-brand-100 text-brand-600',   // alias → gold
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

export const Badge = ({ children, variant = 'neutral', className = '' }: BadgeProps) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${variants[variant]} ${className}`}>
    {children}
  </span>
);
