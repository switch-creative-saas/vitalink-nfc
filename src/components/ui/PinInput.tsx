import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
}

export default function PinInput({
  value,
  onChange,
  length = 4,
  disabled = false,
  hasError = false,
  autoFocus = false,
}: PinInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? '');

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').slice(0, length));
    if (digit && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  return (
    <div className={cn('grid gap-3', length === 4 && 'grid-cols-4', hasError && 'animate-shake')}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          className={cn(
            'aspect-square rounded-2xl border bg-white/50 dark:bg-vita-dark-surfaceLight/55',
            'text-center text-2xl font-bold text-foreground dark:text-vita-dark-text outline-none',
            'transition-colors focus:border-vita-purple dark:focus:border-vita-dark-glowSoft focus:ring-2 focus:ring-vita-purple/20 dark:focus:ring-vita-dark-glow/30',
            hasError ? 'border-red-500/70' : 'border-white/40 dark:border-vita-dark-border',
          )}
          value={digit}
          onChange={(event) => setDigit(index, event.target.value.replace(/\D/g, '').slice(-1))}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !digit && index > 0) {
              refs.current[index - 1]?.focus();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
            const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
            onChange(pasted);
            refs.current[Math.min(pasted.length, length - 1)]?.focus();
          }}
          inputMode="numeric"
          type="password"
          maxLength={1}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          aria-label={`PIN digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
