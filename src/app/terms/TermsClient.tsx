'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function TermsClient() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-slate-300">
        <h1 className="text-4xl font-bold text-white mb-8">{t.terms.title}</h1>
        <p className="mb-6 text-slate-400">{t.terms.intro}</p>
        
        <section className="space-y-8">
            {t.terms.sections.map((section) => (
                <div key={section.title}>
                    <h2 className="text-sm font-bold text-slate-100 mb-4 uppercase tracking-[0.1em]">{section.title}</h2>
                    <div className="space-y-3 text-sm leading-relaxed">
                        {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                </div>
            ))}
        </section>

        <div className="mt-12 pt-12 border-t border-slate-800 text-xs text-slate-500 italic">
            {t.terms.footer}
        </div>
    </div>
  );
}
