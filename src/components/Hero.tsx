"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-slate-950 pt-32 pb-24 lg:pt-48 lg:pb-32">
      {/* Background Engine Aesthetics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse-gpu" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-emerald-500/10 blur-[100px] rounded-full animate-pulse-gpu" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-base relative z-10">
        <div className="max-w-4xl animate-fade-in-up">
          {/* Engine Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md mb-12">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-widest text-emerald-400">
              {t.home.heroBadge}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-white mb-6 leading-tight tracking-tight">
            {t.home.heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-slate-400 mb-12 max-w-xl leading-relaxed">
            {t.home.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/contact"
              className="w-full sm:w-auto px-8 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group animate-luminous animate-shimmer"
            >
              {t.home.ctaShortlist}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/methodology"
              className="w-full sm:w-auto px-8 py-5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-50 rounded-xl font-medium text-lg transition-all flex items-center justify-center"
            >
              {t.home.ctaGoldList}
            </Link>
          </div>
        </div>

        {/* Real-time Metric Indicators */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-900 pt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Zap className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{t.home.heroStat1Value}</div>
              <p className="text-sm text-slate-500">{t.home.heroStat1Label}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{t.home.heroStat2Value}</div>
              <p className="text-sm text-slate-500">{t.home.heroStat2Label}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-500/10 rounded-lg border border-slate-500/20">
              <ArrowRight className="w-6 h-6 text-slate-400 rotate-[-45deg]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{t.home.heroStat3Value}</div>
              <p className="text-sm text-slate-500">{t.home.heroStat3Label}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
