'use client';

import React, { useState, useRef } from 'react';
import { GitBranch, Layers, Briefcase, Target, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/context/translations';

interface HeroGlobeFallbackProps {
  className?: string;
  isReducedMotion?: boolean;
}

export default function HeroGlobeFallback({ className = '', isReducedMotion = false }: HeroGlobeFallbackProps) {
  const { lang, t } = useLanguage();
  const [drag, setDrag] = useState<{ rotX: number; rotY: number; active: boolean }>({
    rotX: 0,
    rotY: 0,
    active: false,
  });
  const isDraggingRef = useRef(false);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const fallbackDict = lang === 'es' ? translations.es.homepage.heroFallback : translations.en.homepage.heroFallback;
  const labels = t?.homepage?.heroFallback ?? fallbackDict;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isReducedMotion || !e.isPrimary) return;
    isDraggingRef.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    setDrag({ rotX: 0, rotY: 0, active: true });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback if pointer capture is unsupported
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || isReducedMotion) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    // Visibly responsive 3D tilt (up to +/- 15 deg)
    const rotY = Math.max(-15, Math.min(15, dx * 0.16));
    const rotX = Math.max(-15, Math.min(15, -dy * 0.16));
    setDrag({ rotX, rotY, active: true });
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setDrag({ rotX: 0, rotY: 0, active: false });
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Fallback
      }
    }
  };

  const shouldAnimate = !isReducedMotion;

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      style={{
        transform: !isReducedMotion && (drag.rotX !== 0 || drag.rotY !== 0)
          ? `perspective(800px) rotateX(${drag.rotX}deg) rotateY(${drag.rotY}deg)`
          : undefined,
        transition: drag.active ? 'transform 0.05s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        touchAction: 'pan-y',
      }}
      className={`relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center select-none overflow-hidden sm:overflow-visible cursor-grab active:cursor-grabbing ${className}`}
      data-testid="hero-globe-fallback"
    >
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-radial from-blue-600/10 via-slate-950/40 to-transparent rounded-full pointer-events-none" />

      {/* Main SVG Vector World */}
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Illustration of distributed LATAM technical talent converging into structured evidence dossiers"
        role="img"
      >
        <defs>
          {/* Subtle glow filter */}
          <filter id="subtle-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <linearGradient id="curve-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="latam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Outer Rotating Globe Structure (Primary 38s Orbit) */}
        <g className={shouldAnimate ? 'mobile-globe-orbit' : ''} data-testid="mobile-globe-orbit-group">
          {/* Outer dashed perimeter */}
          <circle cx="250" cy="250" r="190" stroke="#334155" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.8" />
          <circle cx="250" cy="250" r="170" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 8" opacity="0.6" />

          {/* Coordinate Grid (Parallels & Meridians) */}
          <ellipse cx="250" cy="250" rx="190" ry="60" stroke="#334155" strokeWidth="0.8" opacity="0.4" />
          <ellipse cx="250" cy="250" rx="190" ry="120" stroke="#334155" strokeWidth="0.8" opacity="0.4" />
          <ellipse cx="250" cy="250" rx="60" ry="190" stroke="#334155" strokeWidth="0.8" opacity="0.3" />
          <ellipse cx="250" cy="250" rx="120" ry="190" stroke="#334155" strokeWidth="0.8" opacity="0.3" />

          {/* Satellite Coordinate Markers on Orbit Perimeter (Visible Rotation Anchors) */}
          <circle cx="440" cy="250" r="3.5" fill="#60a5fa" />
          <circle cx="440" cy="250" r="7" stroke="#60a5fa" strokeWidth="0.75" opacity="0.5" />
          <circle cx="60" cy="250" r="3" fill="#38bdf8" />
          <circle cx="250" cy="60" r="3" fill="#60a5fa" />
          <circle cx="250" cy="440" r="3" fill="#38bdf8" />
        </g>

        {/* Counter-Rotating Inner Ring (Secondary 48s Orbit) */}
        <g className={shouldAnimate ? 'mobile-globe-orbit-inner' : ''}>
          <circle cx="250" cy="250" r="140" stroke="#3b82f6" strokeWidth="0.75" opacity="0.35" strokeDasharray="12 8" />
          <circle cx="390" cy="250" r="2" fill="#93c5fd" opacity="0.7" />
          <circle cx="110" cy="250" r="2" fill="#93c5fd" opacity="0.7" />
        </g>

        {/* Stylized LATAM Landmass Vector */}
        <path
          d="M205,175 C215,178 228,172 238,180 C245,185 242,195 240,205 C238,212 245,218 252,225 C260,234 268,245 264,258 C260,270 252,282 248,295 C244,310 240,328 232,342 C228,350 220,358 214,352 C210,344 212,330 215,318 C218,302 216,285 212,270 C208,255 200,242 195,230 C190,218 192,204 198,192 Z"
          fill="url(#latam-gradient)"
          stroke="#334155"
          strokeWidth="1.2"
        />

        {/* Stylized North America snippet */}
        <path
          d="M170,120 C185,122 205,115 220,125 C230,132 235,145 228,155 C220,162 205,160 195,152 Z"
          fill="#0f172a"
          stroke="#1e293b"
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Key Engineering Hub Coordinates in LATAM (Pulsing dots) */}
        {/* Mexico City */}
        <circle cx="198" cy="192" r="3.5" fill="#3b82f6" />
        <circle cx="198" cy="192" r="7" stroke="#3b82f6" strokeWidth="0.75" opacity="0.6" className={shouldAnimate ? 'animate-ping' : ''} />

        {/* Bogotá / Medellín */}
        <circle cx="218" cy="225" r="3.5" fill="#3b82f6" />

        {/* São Paulo / Rio */}
        <circle cx="258" cy="295" r="4" fill="#3b82f6" />
        <circle cx="258" cy="295" r="8" stroke="#3b82f6" strokeWidth="0.75" opacity="0.5" className={shouldAnimate ? 'animate-pulse' : ''} />

        {/* Buenos Aires / Santiago */}
        <circle cx="238" cy="335" r="3.5" fill="#3b82f6" />

        {/* Subtle Arcs connecting LATAM to US & Europe */}
        <path d="M218,225 Q210,130 260,95" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
        <path d="M258,295 Q340,210 380,135" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" opacity="0.25" />

        {/* Convergence Curves toward Evidence Brief (Animated Inbound Flow) */}
        <path
          d="M85,130 C150,150 180,210 280,230"
          stroke="url(#curve-gradient)"
          strokeWidth="2"
          strokeDasharray="8 6"
          className={shouldAnimate ? 'mobile-dash-flow' : ''}
          data-testid="evidence-flow-1"
        />
        <path
          d="M410,140 C350,160 320,200 280,230"
          stroke="url(#curve-gradient)"
          strokeWidth="2"
          strokeDasharray="8 6"
          className={shouldAnimate ? 'mobile-dash-flow' : ''}
          data-testid="evidence-flow-2"
        />
        <path
          d="M90,360 C140,340 210,310 280,230"
          stroke="url(#curve-gradient)"
          strokeWidth="2"
          strokeDasharray="8 6"
          className={shouldAnimate ? 'mobile-dash-flow' : ''}
          data-testid="evidence-flow-3"
        />
        <path
          d="M415,350 C360,330 320,280 280,230"
          stroke="url(#curve-gradient)"
          strokeWidth="2"
          strokeDasharray="8 6"
          className={shouldAnimate ? 'mobile-dash-flow' : ''}
          data-testid="evidence-flow-4"
        />
      </svg>

      {/* Floating Orbital Node: PROJECTS */}
      <div
        className={`absolute top-[12%] left-[4%] px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 shadow-lg backdrop-blur-md flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-300 pointer-events-none ${
          shouldAnimate ? 'mobile-chip-float-1' : ''
        }`}
        data-testid="chip-projects"
      >
        <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="whitespace-nowrap">{labels.projects}</span>
      </div>

      {/* Floating Orbital Node: GITHUB */}
      <div
        className={`absolute top-[14%] right-[4%] px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 shadow-lg backdrop-blur-md flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-300 pointer-events-none ${
          shouldAnimate ? 'mobile-chip-float-2' : ''
        }`}
        data-testid="chip-github"
      >
        <GitBranch className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="whitespace-nowrap">{labels.github}</span>
      </div>

      {/* Floating Orbital Node: WORK EXPERIENCE */}
      <div
        className={`absolute bottom-[16%] left-[6%] px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 shadow-lg backdrop-blur-md flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-300 pointer-events-none ${
          shouldAnimate ? 'mobile-chip-float-3' : ''
        }`}
        data-testid="chip-work-exp"
      >
        <Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="whitespace-nowrap">{labels.workExp}</span>
      </div>

      {/* Floating Orbital Node: ROLE CONTEXT */}
      <div
        className={`absolute bottom-[14%] right-[6%] px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 shadow-lg backdrop-blur-md flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-300 pointer-events-none ${
          shouldAnimate ? 'mobile-chip-float-4' : ''
        }`}
        data-testid="chip-role-context"
      >
        <Target className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="whitespace-nowrap">{labels.roleContext}</span>
      </div>

      {/* Convergence Centerpiece: EVIDENCE BRIEF */}
      <div className="absolute top-[48%] left-[54%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto max-w-[90%]">
        <div
          className={`p-2.5 sm:p-3 rounded-xl bg-slate-900/95 border border-blue-500/50 backdrop-blur-md flex items-center gap-2 sm:gap-2.5 ${
            shouldAnimate ? 'mobile-brief-pulse' : 'shadow-2xl shadow-blue-500/20'
          }`}
          data-testid="evidence-brief-centerpiece"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-left whitespace-nowrap min-w-0">
            <span className="block text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-white truncate">
              {labels.evidenceBrief}
            </span>
            <span className="block text-[9px] sm:text-[10px] text-slate-400 font-sans truncate">
              {labels.decisionReady}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
