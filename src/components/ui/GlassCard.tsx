import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  whileTap?: { scale?: number };
  noSpecular?: boolean;
  borderAccent?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  onClick,
  whileTap,
  noSpecular = false,
  borderAccent,
}) => {
  return (
    <motion.div
      className={cn(
        'relative rounded-2xl backdrop-blur-glass saturate-[120%] overflow-hidden',
        'bg-white/65 dark:bg-vita-dark-surface/60',
        'border border-white/50 dark:border-vita-dark-border',
        'shadow-glass dark:shadow-[0_8px_32px_rgba(147,51,234,0.25)]',
        borderAccent,
        className
      )}
      onClick={onClick}
      whileTap={whileTap || { scale: 0.98 }}
      transition={{ type: 'spring', damping: 20, stiffness: 400 }}
    >
      {!noSpecular && (
        <div className="absolute inset-0 pointer-events-none glass-specular opacity-60 dark:from-vita-dark-glowSoft/20" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
