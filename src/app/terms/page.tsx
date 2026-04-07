'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-slate-300">
          <h1 className="text-4xl font-bold text-white mb-8">{t.terms.title}</h1>
          <p className="mb-6 text-slate-400">{t.terms.intro}</p>
          
          <section className="space-y-8">
              <div>
                  <h2 className="text-xl font-bold text-slate-100 mb-4 uppercase tracking-[0.1em] text-sm">{t.terms.section1Title}</h2>
                  <p className="text-sm leading-relaxed">{t.terms.section1Desc}</p>
              </div>

              <div>
                  <h2 className="text-xl font-bold text-slate-100 mb-4 uppercase tracking-[0.1em] text-sm">{t.terms.section2Title}</h2>
                  <p className="text-sm leading-relaxed">{t.terms.section2Desc}</p>
              </div>

              <div>
                  <h2 className="text-xl font-bold text-slate-100 mb-4 uppercase tracking-[0.1em] text-sm">{t.terms.section3Title}</h2>
                  <p className="text-sm leading-relaxed">{t.terms.section3Desc}</p>
              </div>

              <div>
                  <h2 className="text-xl font-bold text-slate-100 mb-4 uppercase tracking-[0.1em] text-sm">{t.terms.section4Title}</h2>
                  <p className="text-sm leading-relaxed">{t.terms.section4Desc}</p>
              </div>
          </section>

          <div className="mt-12 pt-12 border-t border-slate-800 text-xs text-slate-500 italic">
              {t.terms.footer} {new Date().getFullYear()}.
          </div>
      </div>
  );
}
