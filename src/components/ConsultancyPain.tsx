'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Clock, Hourglass, FileText, ShieldAlert } from 'lucide-react';

export default function ConsultancyPain() {
  const { t } = useLanguage();
  const pain = t.home.pain;

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight leading-tight">
            {pain.title}
          </h2>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Card 1: Senior Time Screening */}
          <div className="p-6 border border-white/5 rounded-2xl bg-slate-900/20 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 group flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center mb-5 border border-blue-500/20 group-hover:bg-blue-600/20 transition-all duration-300">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">{pain.card1Title}</h3>
              <p className="text-slate-400 text-xs font-light leading-relaxed">{pain.card1Desc}</p>
            </div>
          </div>

          {/* Card 2: Slow Response */}
          <div className="p-6 border border-white/5 rounded-2xl bg-slate-900/20 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 group flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center mb-5 border border-blue-500/20 group-hover:bg-blue-600/20 transition-all duration-300">
                <Hourglass className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">{pain.card2Title}</h3>
              <p className="text-slate-400 text-xs font-light leading-relaxed">{pain.card2Desc}</p>
            </div>
          </div>

          {/* Card 3: Incomparable Evidence */}
          <div className="p-6 border border-white/5 rounded-2xl bg-slate-900/20 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 group flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center mb-5 border border-blue-500/20 group-hover:bg-blue-600/20 transition-all duration-300">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">{pain.card3Title}</h3>
              <p className="text-slate-400 text-xs font-light leading-relaxed">{pain.card3Desc}</p>
            </div>
          </div>

          {/* Card 4: Hiring Risk */}
          <div className="p-6 border border-white/5 rounded-2xl bg-slate-900/20 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 group flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center mb-5 border border-blue-500/20 group-hover:bg-blue-600/20 transition-all duration-300">
                <ShieldAlert className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">{pain.card4Title}</h3>
              <p className="text-slate-400 text-xs font-light leading-relaxed">{pain.card4Desc}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
