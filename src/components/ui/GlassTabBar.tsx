import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, HeartPulse, FolderHeart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/emergency', icon: HeartPulse, label: 'SOS' },
  { path: '/records', icon: FolderHeart, label: 'Records' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const GlassTabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav
      className={cn(
        'fixed bottom-4 left-4 right-4 z-50',
        'flex items-center justify-around',
        'h-16 px-2',
        'rounded-full',
        'bg-white/65 dark:bg-vita-dark-surface/70 backdrop-blur-glass saturate-[120%]',
        'border border-white/50 dark:border-vita-dark-border',
        'shadow-float dark:shadow-[0_8px_36px_rgba(147,51,234,0.28)]',
      )}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.5 }}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.path}
            className={cn(
              'relative flex flex-col items-center justify-center w-14 h-14 rounded-full',
              'touch-target',
              isActive && 'text-vita-purple dark:text-vita-dark-glowSoft'
            )}
            onClick={() => navigate(tab.path)}
            whileTap={{ scale: 0.9 }}
          >
            {isActive && (
              <motion.div
                className={cn(
                  'absolute inset-0 rounded-full',
                  'bg-vita-purple/10 dark:bg-vita-dark-glow/20'
                )}
                layoutId="tabIndicator"
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}
            <Icon size={22} className={cn(
              'relative z-10',
              isActive ? 'text-vita-purple dark:text-vita-dark-glowSoft' : 'text-muted-foreground dark:text-vita-dark-textMuted'
            )} />
            <span className={cn(
              'relative z-10 text-[10px] font-medium mt-0.5',
              isActive ? 'text-vita-purple dark:text-vita-dark-glowSoft' : 'text-muted-foreground dark:text-vita-dark-textMuted'
            )}>
              {tab.label}
            </span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
};

export default GlassTabBar;
