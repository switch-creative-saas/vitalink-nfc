import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const GlassToggle: React.FC<GlassToggleProps> = ({ checked, onChange, className }) => {
  return (
    <motion.button
      className={cn(
        'relative w-12 h-7 rounded-full transition-colors duration-200',
        checked
          ? 'bg-vita-purple dark:bg-vita-dark-glow border border-vita-purple/50 dark:border-vita-dark-glowSoft/60 dark:shadow-[0_0_18px_rgba(147,51,234,0.35)]'
          : 'bg-gray-300/50 dark:bg-vita-dark-surfaceLight/60 border border-white/20 dark:border-vita-dark-border',
        className
      )}
      onClick={() => onChange(!checked)}
      whileTap={{ scale: 0.95 }}
      aria-checked={checked}
      role="switch"
    >
      <motion.div
        className={cn(
          'absolute top-0.5 w-6 h-6 rounded-full shadow-md',
          'bg-white dark:bg-vita-dark-text',
          'border border-gray-200/50 dark:border-vita-dark-border'
        )}
        animate={{ left: checked ? 'calc(100% - 26px)' : '2px' }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
      />
    </motion.button>
  );
};

export default GlassToggle;
