import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlassSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  showHandle?: boolean;
}

const GlassSheet: React.FC<GlassSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className,
  showHandle = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            className={cn(
              'fixed bottom-0 left-0 right-0 z-[70]',
              'rounded-t-3xl',
              'bg-white/75 dark:bg-vita-dark-surface/75 backdrop-blur-glass saturate-[120%]',
              'border-t border-white/50 dark:border-vita-dark-border',
              'shadow-float dark:shadow-[0_-8px_36px_rgba(147,51,234,0.28)]',
              'max-h-[90vh] overflow-y-auto scrollbar-hide',
              className
            )}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
          >
            {/* Drag Handle */}
            {showHandle && (
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-400/40" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-5 pt-2 pb-3">
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <motion.button
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    'bg-white/50 dark:bg-vita-dark-surfaceLight/60',
                    'border border-white/30 dark:border-vita-dark-border',
                    'text-foreground dark:text-vita-dark-text'
                  )}
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              </div>
            )}

            {/* Content */}
            <div className="px-5 pb-8">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GlassSheet;
