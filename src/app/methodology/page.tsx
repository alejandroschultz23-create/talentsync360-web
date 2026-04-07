'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function MethodologyPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      <section className="bg-slate-950 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="text-blue-500 font-medium mb-4 block uppercase tracking-widest text-sm">{t.methodology.badge}</span>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-6 tracking-tight">
                {t.methodology.title}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
                {t.methodology.subtitle}
            </p>
        </div>
      </section>

      <section className="bg-slate-900/50 py-24 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                      <h2 className="text-3xl font-bold text-slate-50 mb-8">{t.methodology.criteriaTitle}</h2>
                      <div className="space-y-8">
                          {[
                              { title: t.methodology.criteria1Title, desc: t.methodology.criteria1Desc },
                              { title: t.methodology.criteria2Title, desc: t.methodology.criteria2Desc },
                              { title: t.methodology.criteria3Title, desc: t.methodology.criteria3Desc },
                          ].map((item) => (
                              <div key={item.title} className="flex gap-5 group">
                                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-600/10 text-blue-500 flex items-center justify-center font-bold border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-all">✓</div>
                                  <div>
                                      <h3 className="text-xl font-bold text-slate-50 mb-1">{item.title}</h3>
                                      <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
                  <div className="p-10 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent rounded-2xl pointer-events-none"></div>
                      
                      <h2 className="text-2xl font-bold text-slate-50 mb-6 flex items-center">
                        <span className="w-2 h-8 bg-blue-600 mr-4 rounded-full"></span>
                        {t.methodology.deliverablesTitle}
                      </h2>
                      <p className="text-slate-400 text-sm mb-10">{t.methodology.deliverablesSubtitle}</p>
                      <ul className="space-y-5 relative z-10">
                          {[
                              t.methodology.deliverable1,
                              t.methodology.deliverable2,
                              t.methodology.deliverable3,
                              t.methodology.deliverable4,
                              t.methodology.deliverable5,
                          ].map((item) => (
                              <li key={item} className="flex items-start text-sm text-slate-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 mr-4 flex-shrink-0"></span>
                                  {item}
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>
      </section>

      <section className="bg-slate-950 py-32 text-center border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-4">
              <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">{t.methodology.signalBadge}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-8 tracking-tight">{t.methodology.signalTitle}</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                {t.methodology.signalDesc}
              </p>
              <p className="text-slate-300 font-medium">{t.methodology.signalResult}</p>
          </div>
      </section>
    </div>
  );
}
