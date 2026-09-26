'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyClient() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-slate-300">
        <h1 className="text-4xl font-bold text-white mb-8">{t.privacy.title}</h1>
        <p className="mb-6">{t.privacy.intro}</p>
        
        <section className="space-y-6">
            {t.privacy.sections.map((section) => (
                <div key={section.title} className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
                    <div className="space-y-3 text-sm leading-relaxed">
                        {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                </div>
            ))}
        </section>

        <div className="mt-12 pt-12 border-t border-slate-800 text-xs text-slate-500 italic">
            {t.privacy.footer}
        </div>
    </div>
  );
}
