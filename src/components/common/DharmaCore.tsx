import React from 'react';
import { motion } from 'framer-motion';
import type { DharmaCoreMood } from '../../types';

interface DharmaCoreProps {
  mood?: DharmaCoreMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
}

export const DharmaCore: React.FC<DharmaCoreProps> = ({
  mood = 'calm',
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  // Dimensions
  const sizeMap = {
    sm: { container: 36, core: 24, glow: 32 },
    md: { container: 56, core: 38, glow: 50 },
    lg: { container: 88, core: 60, glow: 80 },
    xl: { container: 120, core: 84, glow: 110 },
  };

  const dims = sizeMap[size];

  // State-specific palette
  const moodConfig = {
    calm: {
      primary: '#0D9488', // Teal
      secondary: '#5EEAD4',
      bgPulse: 'rgba(13, 148, 136, 0.12)',
      label: 'Core Estable',
      pulseSpeed: 3.5,
    },
    focus: {
      primary: '#D97706', // Amber
      secondary: '#FCD34D',
      bgPulse: 'rgba(217, 119, 6, 0.14)',
      label: 'Enfoque Activo',
      pulseSpeed: 2.2,
    },
    celebrate: {
      primary: '#16A34A', // Green joy
      secondary: '#86EFAC',
      bgPulse: 'rgba(22, 163, 74, 0.18)',
      label: 'Protocolo Cumplido',
      pulseSpeed: 1.5,
    },
    syncing: {
      primary: '#0284C7', // Sky
      secondary: '#7DD3FC',
      bgPulse: 'rgba(2, 132, 199, 0.14)',
      label: 'Sincronizando',
      pulseSpeed: 2.0,
    },
    idle: {
      primary: '#8B5CF6', // Lavender
      secondary: '#C4B5FD',
      bgPulse: 'rgba(139, 92, 246, 0.10)',
      label: 'Reposo Consciente',
      pulseSpeed: 4.5,
    },
  }[mood];

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <div 
        className="relative flex items-center justify-center"
        style={{ width: dims.container, height: dims.container }}
      >
        {/* Ambient breathing aura */}
        <motion.div
          animate={{
            scale: [1, 1.14, 1],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: moodConfig.pulseSpeed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full filter blur-md pointer-events-none"
          style={{
            width: dims.glow,
            height: dims.glow,
            backgroundColor: moodConfig.primary,
          }}
        />

        {/* Outer Orbit Ring (Subtle tech station aesthetic) */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: mood === 'focus' ? 12 : 24,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute rounded-full border border-dashed pointer-events-none"
          style={{
            width: dims.container - 4,
            height: dims.container - 4,
            borderColor: `${moodConfig.primary}33`,
          }}
        >
          {/* Orbit dot */}
          <span 
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: moodConfig.secondary }}
          />
        </motion.div>

        {/* Main Organic Mascot Core SVG */}
        <motion.svg
          width={dims.core}
          height={dims.core}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{
            y: [-1.5, 1.5, -1.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10 drop-shadow-sm"
        >
          <defs>
            <linearGradient id={`coreGrad-${mood}`} x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.6" stopColor="#F8FAFC" />
              <stop offset="1" stopColor="#EDF2F7" />
            </linearGradient>

            <linearGradient id={`ringGrad-${mood}`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor={moodConfig.secondary} />
              <stop offset="1" stopColor={moodConfig.primary} />
            </linearGradient>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Organic Core Pebble Body */}
          <path
            d="M50 10 C74 10 90 26 90 50 C90 74 74 90 50 90 C26 90 10 74 10 50 C10 26 26 10 50 10 Z"
            fill={`url(#coreGrad-${mood})`}
            stroke={moodConfig.primary}
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Inner Light Dome */}
          <path
            d="M32 28 C42 22 58 22 68 28 C62 34 38 34 32 28 Z"
            fill="#FFFFFF"
            opacity="0.85"
          />

          {/* Mascot Eyes / Interface Visor */}
          {mood === 'celebrate' ? (
            /* Joyful eyes */
            <g stroke={moodConfig.primary} strokeWidth="3" strokeLinecap="round">
              <path d="M36 48 Q42 42 48 48" />
              <path d="M52 48 Q58 42 64 48" />
              {/* Little smile */}
              <circle cx="50" cy="58" r="2.5" fill={moodConfig.primary} />
            </g>
          ) : mood === 'focus' ? (
            /* Focused eyes */
            <g fill={moodConfig.primary}>
              <circle cx="42" cy="46" r="3" />
              <circle cx="58" cy="46" r="3" />
              <rect x="36" y="39" width="12" height="2" rx="1" fill={moodConfig.primary} />
              <rect x="52" y="39" width="12" height="2" rx="1" fill={moodConfig.primary} />
            </g>
          ) : (
            /* Friendly gentle serene eyes */
            <g>
              {/* Eye left */}
              <motion.circle
                cx="41"
                cy="47"
                r="3.5"
                fill={moodConfig.primary}
                animate={{
                  scaleY: [1, 1, 0.15, 1, 1],
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  times: [0, 0.45, 0.5, 0.55, 1],
                }}
              />
              <circle cx="42.5" cy="45.5" r="1.2" fill="#FFFFFF" />

              {/* Eye right */}
              <motion.circle
                cx="59"
                cy="47"
                r="3.5"
                fill={moodConfig.primary}
                animate={{
                  scaleY: [1, 1, 0.15, 1, 1],
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  times: [0, 0.45, 0.5, 0.55, 1],
                }}
              />
              <circle cx="60.5" cy="45.5" r="1.2" fill="#FFFFFF" />

              {/* Small harmonic central node */}
              <circle
                cx="50"
                cy="56"
                r="1.8"
                fill={moodConfig.secondary}
              />
            </g>
          )}

          {/* Core harmonic pulse ring at the bottom */}
          <path
            d="M38 68 C44 71 56 71 62 68"
            stroke={moodConfig.primary}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.35"
          />
        </motion.svg>
      </div>

      {showLabel && (
        <span 
          className="mt-1 text-[11px] font-semibold tracking-wider uppercase"
          style={{ color: moodConfig.primary }}
        >
          {moodConfig.label}
        </span>
      )}
    </div>
  );
};
