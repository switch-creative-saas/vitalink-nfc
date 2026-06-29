import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/data/translations';
import { cn } from '@/lib/utils';

export const LANGUAGE_OPTIONS: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ha', label: 'Hausa', nativeLabel: 'Hausa' },
  { code: 'yo', label: 'Yoruba', nativeLabel: 'Yorùbá' },
  { code: 'ig', label: 'Igbo', nativeLabel: 'Igbo' },
];

interface LanguageSwitcherProps {
  variant?: 'icon' | 'full';
}

export default function LanguageSwitcher({ variant = 'icon' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = LANGUAGE_OPTIONS.find((l) => l.code === language);

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-expanded={open}
        className={cn(
          'h-10 min-w-10 rounded-full px-3',
          'flex items-center justify-center gap-1.5',
          'bg-white/65 dark:bg-vita-dark-surface/60 backdrop-blur-glass saturate-[120%]',
          'border border-white/50 dark:border-vita-dark-border',
          'text-sm font-medium text-foreground dark:text-vita-dark-text shadow-glass dark:shadow-[0_8px_28px_rgba(147,51,234,0.24)]',
          'hover:bg-white/80 dark:hover:bg-vita-dark-surfaceLight/70 transition-colors',
        )}
        whileTap={{ scale: 0.97 }}
      >
        <Globe size={16} />
        {variant === 'full' && <span>{current?.nativeLabel}</span>}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'absolute right-0 mt-2 w-44 z-50 overflow-hidden rounded-2xl',
                'bg-white/75 dark:bg-vita-dark-surface/80 backdrop-blur-glass saturate-[120%]',
                'border border-white/50 dark:border-vita-dark-border shadow-float dark:shadow-[0_8px_36px_rgba(147,51,234,0.28)]',
              )}
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    setLanguage(opt.code);
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm text-foreground dark:text-vita-dark-text hover:bg-vita-purple/10 dark:hover:bg-vita-dark-glow/15 transition-colors"
                >
                  <span className="flex flex-col items-start">
                    <span className="font-medium">{opt.nativeLabel}</span>
                    {opt.label !== opt.nativeLabel && (
                      <span className="text-xs text-muted-foreground dark:text-vita-dark-textMuted">{opt.label}</span>
                    )}
                  </span>
                  {language === opt.code && <Check size={16} className="text-vita-purple dark:text-vita-dark-glowSoft" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
