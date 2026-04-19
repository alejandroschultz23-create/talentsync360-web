"use client";

import React from "react";
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              {t.home.heroBadge}
            </span>
          </div>

          <h1 className="text-hero leading-[1.1] mb-8 text-premium-gradient">
            {t.home.heroTitle}
          </h1>

          <p className="text-lg text-slate-400 mb-12 max-w-2xl leading-relaxed">
            {t.home.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 group animate-luminous animate-shimmer">
              {t.home.ctaShortlist}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
              {t.home.ctaGoldList}
            </button>
          </div>
        </div>

        {/* Real-time Metric Indicators */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-900 pt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Zap className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">72h</div>
              <p className="text-sm text-slate-500">Shortlist Delivery</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">95%</div>
              <p className="text-sm text-slate-500">Retention Rate</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-500/10 rounded-lg border border-slate-500/20">
              <ArrowRight className="w-6 h-6 text-slate-400 rotate-[-45deg]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">60%</div>
              <p className="text-sm text-slate-500">Avg. Runway Extension</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
