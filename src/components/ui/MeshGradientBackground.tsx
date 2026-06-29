import React, { useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface MeshGradientBackgroundProps {
  variant?: 'default' | 'emergency';
}

const MeshGradientBackground: React.FC<MeshGradientBackgroundProps> = ({ variant = 'default' }) => {
  const { theme } = useTheme();

  const gradientStyle = useMemo(() => {
    const isDark = theme === 'dark';

    if (variant === 'emergency') {
      if (isDark) {
        return {
          background: 'linear-gradient(135deg, rgba(127,29,29,0.52) 0%, rgba(21,9,31,0.9) 30%, rgba(88,28,135,0.58) 60%, rgba(31,15,48,0.94) 100%)',
          backgroundSize: '300% 300%',
        };
      }
      return {
        background: 'linear-gradient(135deg, rgba(254,226,226,0.6) 0%, rgba(255,255,255,0.7) 30%, rgba(224,231,255,0.5) 60%, rgba(243,232,255,0.6) 100%)',
        backgroundSize: '300% 300%',
      };
    }

    if (isDark) {
      return {
        background: 'linear-gradient(135deg, #15091F 0%, #1F0F30 25%, #2D1654 50%, #1A0E2E 75%, #150A22 100%)',
        backgroundSize: '300% 300%',
      };
    }

    return {
      background: 'linear-gradient(135deg, #EEF2F6 0%, #E2EBF3 25%, #D8E4F0 50%, #E8EDF5 75%, #E2EBF3 100%)',
      backgroundSize: '300% 300%',
    };
  }, [variant, theme]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 animate-mesh-shift" style={gradientStyle} />

      {theme === 'dark' && (
        <>
          <div
            className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-[100px]"
            style={{
              background: '#9333EA',
              top: '10%',
              right: '-10%',
            }}
          />
          <div
            className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
            style={{
              background: '#7C3AED',
              bottom: '5%',
              left: '-5%',
            }}
          />
        </>
      )}
    </div>
  );
};

export default MeshGradientBackground;
