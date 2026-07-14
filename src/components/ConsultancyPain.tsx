'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function ConsultancyPain() {
  const { t } = useLanguage();
  const pain = t.home.pain;

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight leading-tight">
            {pain.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Slow Response */}
          <div className="p-8 border border-white/5 rounded-2xl bg-slate-900/20 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-600/20 transition-all duration-300">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-4">{pain.slowResponseTitle}</h3>
            <p className="text-slate-400 leading-relaxed font-light">{pain.slowResponseDesc}</p>
          </div>

          {/* Card 2: Senior Time Leakage */}
          <div className="p-8 border border-white/5 rounded-2xl bg-slate-900/20 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-600/20 transition-all duration-300">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-4">{pain.timeLeakTitle}</h3>
            <p className="text-slate-400 leading-relaxed font-light">{pain.timeLeakDesc}</p>
          </div>

          {/* Card 3: Reputation Risk */}
          <div className="p-8 border border-white/5 rounded-2xl bg-slate-900/20 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-600/20 transition-all duration-300">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-4">{pain.reputationTitle}</h3>
            <p className="text-slate-400 leading-relaxed font-light">{pain.reputationDesc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
