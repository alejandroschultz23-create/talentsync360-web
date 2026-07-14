'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function ConsultancyUseCases() {
  const { t } = useLanguage();
  const cases = t.home.useCases;

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-4">
            {cases.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight">
            {cases.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.items.map((item: { title: string; desc: string }, index: number) => (
            <div
              key={index}
              className="p-8 border border-white/5 rounded-2xl bg-slate-900/20 hover:border-blue-500/20 transition-all duration-300 group flex flex-col justify-between min-h-[180px]"
            >
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-3 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
