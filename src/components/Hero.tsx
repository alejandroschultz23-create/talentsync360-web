"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  const handleScrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("white-label-demo");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 pt-32 pb-24 lg:pt-48 lg:pb-32">
      {/* Background Engine Aesthetics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-gpu" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-emerald-500/10 blur-[100px] rounded-full animate-pulse-gpu" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-base relative z-10">
        <div className="max-w-4xl animate-fade-in-up">
          {/* Engine Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md mb-12">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              {t.home.heroBadge}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-white mb-6 leading-[1.3] tracking-tight">
            {t.home.heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-slate-400 mb-12 max-w-2xl leading-relaxed font-light">
            {t.home.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact?intent=shortlist-sprint"
              className="h-11 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-1.5 group shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98"
            >
              {t.home.ctaShortlist}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#white-label-demo"
              onClick={handleScrollToDemo}
              className="h-11 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-50 rounded-xl font-semibold text-sm transition-all flex items-center justify-center active:scale-98"
            >
              {t.home.ctaGoldList}
            </a>
            <Link
              href="/talents"
              className="h-11 px-5 bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center active:scale-98"
            >
              {t.home.ctaTalent}
            </Link>
          </div>
        </div>

        {/* Real-time Metric Indicators */}
        <div className="mt-20 border-t border-slate-900 pt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Zap className="w-6 h-6 text-blue-550" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{t.home.heroStat1Value}</div>
                <p className="text-xs text-slate-500 font-light mt-1">{t.home.heroStat1Label}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{t.home.heroStat2Value}</div>
                <p className="text-xs text-slate-500 font-light mt-1">{t.home.heroStat2Label}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <ArrowRight className="w-6 h-6 text-blue-400 rotate-[-45deg]" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{t.home.heroStat3Value}</div>
                <p className="text-xs text-slate-500 font-light mt-1">{t.home.heroStat3Label}</p>
              </div>
            </div>
          </div>

          {/* Qualifier Disclaimer */}
          <div className="text-xs text-slate-500 font-light lg:whitespace-nowrap leading-relaxed">
            {t.home.heroQualifier}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
