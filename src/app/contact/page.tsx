'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function ContactForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [contactType, setContactType] = useState<'b2b' | 'talent' | 'general'>('b2b');

  useEffect(() => {
    const tipo = searchParams.get('tipo');
    if (tipo === 'talent') {
      setContactType('talent');
    } else if (tipo === 'general') {
      setContactType('general');
    } else {
      setContactType('b2b');
    }
  }, [searchParams]);

  const isTalent = contactType === 'talent';
  const isGeneral = contactType === 'general';

  return (
    <>
      <section className="bg-slate-950 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-6 tracking-tight">
                {isTalent ? (t.contact.titleTalent || t.contact.title) : t.contact.title}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
                {isTalent 
                  ? (t.contact.subtitleTalent || t.contact.subtitle)
                  : isGeneral 
                    ? (t.contact.subtitleGeneral || t.contact.subtitle)
                    : t.contact.subtitle}
            </p>
        </div>
      </section>

      <section className="bg-slate-900/50 py-16 mb-24 max-w-4xl mx-auto rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
          
          <form className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-semibold text-slate-300">{t.contact.labelName}</label>
                      <input type="text" id="name" required className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none" placeholder={t.contact.placeholderName} />
                  </div>
                  <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-slate-300">{t.contact.labelEmail}</label>
                      <input type="email" id="email" required className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none" placeholder={t.contact.placeholderEmail} />
                  </div>
              </div>

              {isTalent && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="currentRole" className="text-sm font-semibold text-slate-300">{t.contact.labelCurrentRole}</label>
                      <input type="text" id="currentRole" required className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none" placeholder={t.contact.placeholderCurrentRole} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="experience" className="text-sm font-semibold text-slate-300">{t.contact.labelExperience}</label>
                      <input type="text" id="experience" required className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none" placeholder={t.contact.placeholderExperience} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="englishLevel" className="text-sm font-semibold text-slate-300">{t.contact.labelEnglishLevel}</label>
                    <select id="englishLevel" className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none appearance-none cursor-pointer">
                      <option>C1+ (Advanced/Fluent)</option>
                      <option>C1 (Professional Working)</option>
                      <option>B2 (Upper Intermediate)</option>
                      <option>B1 (Intermediate)</option>
                    </select>
                  </div>
                </>
              )}

              {!isTalent && !isGeneral && (
                <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-semibold text-slate-300">{t.contact.labelRole}</label>
                    <select id="role" className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none appearance-none cursor-pointer">
                        <option>{t.contact.optionB2B}</option>
                        <option>{t.contact.optionB2C}</option>
                        <option>{t.contact.optionGeneral}</option>
                    </select>
                </div>
              )}

              <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold text-slate-300">
                    {isTalent ? t.contact.labelMessageTalent : t.contact.labelMessage}
                  </label>
                  <textarea id="message" rows={5} required className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none resize-none" placeholder={isTalent ? t.contact.placeholderMessageTalent : t.contact.placeholderMessage}></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-lg font-bold text-xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]">
                {isTalent ? t.contact.buttonSubmitTalent : t.contact.buttonSubmit}
              </button>
              <div className="text-center">
                  <p className="text-xs text-slate-500">{t.contact.privacyNote}</p>
              </div>
          </form>
      </section>

      {!isTalent && (
        <div className="text-center mb-32 group">
            <p className="text-slate-500 mb-6 font-bold uppercase tracking-[0.2em] text-xs">{t.contact.directLabel}</p>
              <a 
                href="https://calendly.com/talentsync360" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center px-10 py-6 bg-slate-950 border border-slate-800 rounded-2xl text-slate-50 font-bold text-xl hover:border-blue-600/50 hover:bg-slate-900 transition-all shadow-xl"
              >
                {t.contact.ctaButton}
              </a>
        </div>
      )}
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950"></div>}>
      <ContactForm />
    </Suspense>
  );
}
