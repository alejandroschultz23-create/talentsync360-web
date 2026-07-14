'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();
  const how = t.home.howItWorks;

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight">
            {how.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">

          {/* Connector Line (visible only on desktop md and up) */}
          <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-0.5 border-t border-dashed border-white/10 pointer-events-none -z-10" />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-4 group">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-blue-400 font-bold text-xl group-hover:border-blue-500/40 group-hover:bg-slate-800/50 transition-all duration-300 shadow-xl">
              1
            </div>
            <h3 className="text-xl font-semibold text-slate-100">{how.step1Title}</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xs">
              {how.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-4 group">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-blue-400 font-bold text-xl group-hover:border-blue-500/40 group-hover:bg-slate-800/50 transition-all duration-300 shadow-xl">
              2
            </div>
            <h3 className="text-xl font-semibold text-slate-100">{how.step2Title}</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xs">
              {how.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-4 group">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-blue-400 font-bold text-xl group-hover:border-blue-500/40 group-hover:bg-slate-800/50 transition-all duration-300 shadow-xl">
              3
            </div>
            <h3 className="text-xl font-semibold text-slate-100">{how.step3Title}</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xs">
              {how.step3Desc}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
