import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessStateProps {
  show: boolean;
  message?: string;
  className?: string;
}

const SuccessState: React.FC<SuccessStateProps> = ({ show, message = 'Success!', className }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]',
            'flex flex-col items-center gap-3',
            'px-8 py-6 rounded-3xl',
            'bg-white/80 dark:bg-vita-dark-surface/80 backdrop-blur-glass',
            'border border-white/50 dark:border-vita-dark-border',
            'shadow-float dark:shadow-[0_8px_36px_rgba(147,51,234,0.28)]',
            className
          )}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <motion.div
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center',
              'bg-emerald-500/20 border border-emerald-500/30'
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 400, delay: 0.1 }}
          >
            <Check size={32} className="text-emerald-500" strokeWidth={3} />
          </motion.div>
          <motion.p
            className="text-foreground dark:text-vita-dark-text font-medium text-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessState;
