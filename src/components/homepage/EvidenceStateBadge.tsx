'use client';

import React from 'react';
import { ShieldCheck, CircleDot, HelpCircle, AlertTriangle, Compass } from 'lucide-react';

export type EvidenceState = 'SUPPORTED' | 'PARTIAL' | 'UNKNOWN' | 'CONFLICT' | 'NEEDS_VALIDATION';

interface EvidenceStateBadgeProps {
  state: EvidenceState;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showTooltip?: boolean;
  className?: string;
}

const STATE_CONFIG: Record<
  EvidenceState,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    dark: {
      bg: string;
      border: string;
      text: string;
    };
    light: {
      bg: string;
      border: string;
      text: string;
    };
  }
> = {
  SUPPORTED: {
    label: 'SUPPORTED',
    icon: ShieldCheck,
    description: 'Observable or attributable evidence supports the capability relevant to the specified role requirement.',
    dark: {
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
    },
    light: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
    },
  },
  PARTIAL: {
    label: 'PARTIAL',
    icon: CircleDot,
    description: 'Foundational, adjacent, or bounded evidence is available, but the depth or comparable context required by the role remains unconfirmed.',
    dark: {
      bg: 'bg-amber-950/40',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
    },
    light: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
    },
  },
  UNKNOWN: {
    label: 'UNKNOWN',
    icon: HelpCircle,
    description: 'The available evidence does not support a conclusion. Missing evidence is not failure; it highlights an area for live interview discussion.',
    dark: {
      bg: 'bg-slate-900/50',
      border: 'border-dashed border-slate-600/40',
      text: 'text-slate-400',
    },
    light: {
      bg: 'bg-slate-100',
      border: 'border-dashed border-slate-300',
      text: 'text-slate-600',
    },
  },
  CONFLICT: {
    label: 'CONFLICT',
    icon: AlertTriangle,
    description: 'Two or more available sources provide materially inconsistent information that cannot currently be reconciled.',
    dark: {
      bg: 'bg-rose-950/40',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
    },
    light: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-800',
    },
  },
  NEEDS_VALIDATION: {
    label: 'NEEDS VALIDATION',
    icon: Compass,
    description: 'A relevant question requires additional evidence or live human discussion before a conclusion can be made.',
    dark: {
      bg: 'bg-violet-950/40',
      border: 'border-violet-500/30',
      text: 'text-violet-400',
    },
    light: {
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      text: 'text-violet-800',
    },
  },
};

export default function EvidenceStateBadge({
  state,
  variant = 'dark',
  size = 'md',
  showIcon = true,
  showTooltip = false,
  className = '',
}: EvidenceStateBadgeProps) {
  const config = STATE_CONFIG[state];
  const Icon = config.icon;
  const theme = variant === 'dark' ? config.dark : config.light;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center rounded-md font-mono font-semibold tracking-wider uppercase border transition-all ${theme.bg} ${theme.border} ${theme.text} ${sizeClasses} ${className} group`}
      aria-label={`Evidence State: ${config.label}`}
      role="status"
    >
      {showIcon && <Icon className={`${iconSizes} shrink-0`} aria-hidden="true" />}
      <span>{config.label}</span>

      {showTooltip && (
        <div
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 rounded-lg bg-slate-900 text-slate-200 text-xs normal-case font-sans font-normal leading-relaxed shadow-xl border border-slate-700/60 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 text-left"
        >
          <span className="font-semibold block mb-0.5 text-slate-100">{config.label}:</span>
          {config.description}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
