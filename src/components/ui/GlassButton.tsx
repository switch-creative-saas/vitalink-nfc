import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  className,
  onClick,
  variant = 'default',
  size = 'md',
  icon,
  fullWidth = false,
  disabled = false,
  type = 'button',
}) => {
  const baseClasses = cn(
    'relative rounded-full font-medium flex items-center justify-center gap-2',
    'transition-colors duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    fullWidth && 'w-full',
    size === 'sm' && 'h-9 px-4 text-sm',
    size === 'md' && 'h-11 px-6',
    size === 'lg' && 'h-14 px-8 text-lg',
  );

  const variantClasses = {
    default: cn(
      'bg-white/65 dark:bg-vita-dark-surface/60 backdrop-blur-glass',
      'border border-white/50 dark:border-vita-dark-border',
      'text-foreground dark:text-vita-dark-text hover:bg-white/80 dark:hover:bg-vita-dark-surfaceLight/70',
      'shadow-glass dark:shadow-[0_8px_28px_rgba(147,51,234,0.22)]',
    ),
    primary: cn(
      'bg-vita-purple dark:bg-vita-dark-glow text-white',
      'hover:bg-vita-purple/90 dark:hover:bg-vita-dark-glowSoft',
      'shadow-vita dark:shadow-[0_8px_32px_rgba(147,51,234,0.38)]',
    ),
    danger: cn(
      'bg-red-600 text-white',
      'hover:bg-red-700',
      'shadow-lg shadow-red-600/30',
    ),
    whatsapp: cn(
      'bg-[#25D366]/20 border border-[#25D366]/40 text-[#128C7E]',
      'hover:bg-[#25D366]/30 dark:text-emerald-300 dark:shadow-[0_8px_28px_rgba(37,211,102,0.16)]',
    ),
  };

  return (
    <motion.button
      type={type}
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={onClick}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', damping: 20, stiffness: 400 }}
      disabled={disabled}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default GlassButton;
