import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPillProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'danger' | 'warning' | 'success' | 'info';
  size?: 'sm' | 'md';
}

const GlassPill: React.FC<GlassPillProps> = ({
  children,
  className,
  variant = 'default',
  size = 'sm',
}) => {
  const variantClasses = {
    default: 'bg-white/50 dark:bg-vita-dark-surfaceLight/50 text-foreground dark:text-vita-dark-text border-white/30 dark:border-vita-dark-border',
    primary: 'bg-vita-purple/15 dark:bg-vita-dark-glow/20 text-vita-purple dark:text-vita-dark-glowSoft border-vita-purple/30 dark:border-vita-dark-border',
    danger: 'bg-red-500/15 text-red-700 border-red-500/30',
    warning: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
    success: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
    info: 'bg-blue-500/15 dark:bg-vita-dark-glow/15 text-blue-700 dark:text-vita-dark-textMuted border-blue-500/30 dark:border-vita-dark-border',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border backdrop-blur-sm',
        size === 'sm' && 'px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        size === 'md' && 'px-3 py-1 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default GlassPill;
