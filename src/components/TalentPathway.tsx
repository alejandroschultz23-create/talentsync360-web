'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles } from 'lucide-react';

export default function TalentPathway() {
  const { t } = useLanguage();
  const path = t.home.talentPathway;

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        
        {/* Glow background accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none -z-10" />

        <div className="p-8 md:p-12 border border-emerald-500/10 rounded-3xl bg-slate-900/10 backdrop-blur-md max-w-3xl mx-auto shadow-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LATAM Talent</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4 tracking-tight leading-snug">
            {path.title}
          </h3>
          
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed mb-8 max-w-xl mx-auto">
            {path.desc}
          </p>

          <div>
            <Link
              href="/talents"
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98"
            >
              {path.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
