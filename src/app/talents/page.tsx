'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function TalentsPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      <section className="bg-slate-950 pt-24 pb-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center">
              <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest">{t.talents.badge}</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-6">
            {t.talents.title.split('.')[0]}.<br className="hidden md:block" /> {t.talents.title.split('.')[1]?.trim()}.
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            {t.talents.subtitle}
            <span className="block text-blue-500 mt-2 italic font-normal text-base">{t.talents.subtitleAccent}</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/contact?tipo=talent" 
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              {t.talents.ctaApply}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-32 border-y border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="mb-24">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-50 mb-6 tracking-tight">{t.talents.processTitle}</h2>
                <div className="w-16 h-1 bg-blue-600/30"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-10 md:p-12 bg-slate-900/40 border border-white/5 rounded-[2.5rem] relative group hover:border-blue-500/20 hover:bg-slate-900/60 transition-all backdrop-blur-xl shadow-2xl">
                      <div className="text-blue-500 font-bold text-xs mb-10 uppercase tracking-[0.2em]">{t.talents.stage1Label}</div>
                      <h3 className="text-lg font-bold text-slate-50 mb-6 group-hover:text-blue-400 transition-colors">{t.talents.stage1Title}</h3>
                      <p className="text-slate-400 font-light leading-[1.7] text-sm">{t.talents.stage1Desc}</p>
                  </div>
                  
                  <div className="p-10 md:p-12 bg-slate-900/40 border border-white/5 rounded-[2.5rem] relative group hover:border-emerald-500/20 hover:bg-slate-900/60 transition-all backdrop-blur-xl shadow-2xl">
                      <div className="text-emerald-500 font-bold text-xs mb-10 uppercase tracking-[0.2em]">{t.talents.stage2Label}</div>
                      <h3 className="text-lg font-bold text-slate-50 mb-6 group-hover:text-emerald-400 transition-colors">{t.talents.stage2Title}</h3>
                      <p className="text-slate-400 font-light leading-[1.7] text-sm">{t.talents.stage2Desc}</p>
                  </div>
 
                  <div className="p-10 md:p-12 bg-blue-600/5 border border-blue-500/10 rounded-[2.5rem] relative group hover:border-blue-600/30 hover:bg-blue-600/10 transition-all backdrop-blur-xl shadow-2xl">
                      <div className="text-blue-600 font-bold text-xs mb-10 uppercase tracking-[0.2em]">{t.talents.stage3Label}</div>
                      <h3 className="text-lg font-bold text-slate-50 mb-6 group-hover:text-blue-600 transition-colors">{t.talents.stage3Title}</h3>
                      <p className="text-slate-400 font-light leading-[1.7] text-sm">{t.talents.stage3Desc}</p>
                  </div>
              </div>
          </div>
      </section>
 
      <section className="bg-slate-950 py-32">
          <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                  <div className="space-y-16">
                      <h2 className="text-2xl font-bold text-slate-50 tracking-tight">{t.talents.benefitTitle}</h2>
                      
                      <div className="space-y-12">
                        <div className="flex gap-8 group">
                          <div className="flex-shrink-0 w-1 px-0.5 bg-blue-600/20 group-hover:bg-blue-600 transition-colors duration-500"></div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-100">{t.talents.benefit1Title}</h4>
                            <p className="text-sm text-slate-500 font-light mt-3 leading-relaxed">{t.talents.benefit1Desc}</p>
                          </div>
                        </div>
                        <div className="flex gap-8 group">
                          <div className="flex-shrink-0 w-1 px-0.5 bg-blue-600/20 group-hover:bg-blue-600 transition-colors duration-500"></div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-100">{t.talents.benefit2Title}</h4>
                            <p className="text-sm text-slate-500 font-light mt-3 leading-relaxed">{t.talents.benefit2Desc}</p>
                          </div>
                        </div>
                        <div className="flex gap-8 group">
                          <div className="flex-shrink-0 w-1 px-0.5 bg-blue-600/20 group-hover:bg-blue-600 transition-colors duration-500"></div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-100">{t.talents.benefit3Title}</h4>
                            <p className="text-sm text-slate-500 font-light mt-3 leading-relaxed">{t.talents.benefit3Desc}</p>
                          </div>
                        </div>
                      </div>
                  </div>
                  
                  <div className="bg-slate-900/40 border border-white/5 p-12 md:p-16 rounded-[3rem] shadow-2xl backdrop-blur-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px]"></div>
                    <h3 className="text-xl font-bold text-white mb-12">{t.talents.checklistTitle}</h3>
                    <ul className="space-y-6 mb-16">
                      <li className="flex items-start text-slate-400 font-light group">
                        <span className="text-blue-500 mr-4 mt-1 bg-blue-500/10 p-1 rounded">✔</span>
                        <span className="group-hover:text-slate-200 transition-colors">{t.talents.checklist1}</span>
                      </li>
                      <li className="flex items-start text-slate-400 font-light group">
                        <span className="text-blue-500 mr-4 mt-1 bg-blue-500/10 p-1 rounded">✔</span>
                        <span className="group-hover:text-slate-200 transition-colors">{t.talents.checklist2}</span>
                      </li>
                      <li className="flex items-start text-slate-400 font-light group">
                        <span className="text-blue-500 mr-4 mt-1 bg-blue-500/10 p-1 rounded">✔</span>
                        <span className="group-hover:text-slate-200 transition-colors">{t.talents.checklist3}</span>
                      </li>
                    </ul>
                    <Link href="/contact" className="block w-full text-center py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95">{t.talents.ctaButton}</Link>
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
}
