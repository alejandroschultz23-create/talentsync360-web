'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-slate-300">
          <h1 className="text-4xl font-bold text-white mb-8">{t.privacy.title}</h1>
          <p className="mb-6">{t.privacy.intro}</p>
          
          <section className="space-y-6">
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h2 className="text-xl font-bold text-white mb-3">{t.privacy.section1Title}</h2>
                  <p className="text-sm leading-relaxed">{t.privacy.section1Desc}</p>
              </div>

              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h2 className="text-xl font-bold text-white mb-3">{t.privacy.section2Title}</h2>
                  <ul className="list-disc pl-5 text-sm space-y-2">
                      <li>{t.privacy.section2ListItem1}</li>
                      <li>{t.privacy.section2ListItem2}</li>
                      <li>{t.privacy.section2ListItem3}</li>
                      <li>{t.privacy.section2ListItem4}</li>
                  </ul>
              </div>

              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h2 className="text-xl font-bold text-white mb-3">{t.privacy.section3Title}</h2>
                  <p className="text-sm leading-relaxed">{t.privacy.section3Desc}</p>
              </div>

              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h2 className="text-xl font-bold text-white mb-3">{t.privacy.section4Title}</h2>
                  <p className="text-sm leading-relaxed">{t.privacy.section4Desc}</p>
              </div>
          </section>

          <div className="mt-12 pt-12 border-t border-slate-800 text-xs text-slate-500 italic">
              {t.privacy.footer} {new Date().getFullYear()}. Note: This is an interim policy for the V1 launch.
          </div>
      </div>
  );
}
