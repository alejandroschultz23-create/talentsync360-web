'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function ContactForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [contactType, setContactType] = useState<'b2b' | 'talent' | 'general'>('b2b');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetch('/api/send?t=' + Date.now(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...data,
          contactType,
          lang: t.contact.title.includes('Touch') || t.contact.title.includes('Get') ? 'en' : 'es',
          pageOrigin: typeof window !== 'undefined' ? window.location.pathname : ''
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      
      setIsSuccess(true);
    } catch (err: unknown) {
      console.error('Submission error:', err);
      setError('FALLA TÉCNICA DETECTADA');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          
          {isSuccess ? (
            <div className="text-center py-12 space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
              <p className="text-slate-400 max-w-sm mx-auto">We&apos;ve received your inquiry and will get back to you within 24 hours.</p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="text-blue-500 font-semibold hover:text-blue-400 transition-colors"
                type="button"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-semibold text-slate-300">{t.contact.labelFirstName}</label>
                        <input name="firstName" type="text" id="firstName" required className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none" placeholder={t.contact.placeholderFirstName} />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-semibold text-slate-300">{t.contact.labelLastName}</label>
                        <input name="lastName" type="text" id="lastName" required className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none" placeholder={t.contact.placeholderLastName} />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-300">{t.contact.labelEmail}</label>
                    <input name="email" type="email" id="email" required className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none" placeholder={t.contact.placeholderEmail} />
                </div>

                {isTalent && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label htmlFor="currentRole" className="text-sm font-semibold text-slate-300">{t.contact.labelCurrentRole}</label>
                        <input name="currentRole" type="text" id="currentRole" required className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none" placeholder={t.contact.placeholderCurrentRole} />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="experience" className="text-sm font-semibold text-slate-300">{t.contact.labelExperience}</label>
                        <input name="experience" type="text" id="experience" required className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none" placeholder={t.contact.placeholderExperience} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="englishLevel" className="text-sm font-semibold text-slate-300">{t.contact.labelEnglishLevel}</label>
                      <select name="englishLevel" id="englishLevel" required className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none appearance-none cursor-pointer">
                        <option value="">{t.contact.labelEnglishLevel}</option>
                        <option value="C1+">C1+ (Advanced/Fluent)</option>
                        <option value="C1">C1 (Professional Working)</option>
                        <option value="B2">B2 (Upper Intermediate)</option>
                        <option value="B1">B1 (Intermediate)</option>
                      </select>
                    </div>
                  </>
                )}

                  <div className="space-y-2">
                      <label htmlFor="role" className="text-sm font-semibold text-slate-300">{t.contact.labelRole}</label>
                      <select name="role" id="role" required className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none appearance-none cursor-pointer">
                          <option value="">{t.contact.labelRole}</option>
                          <option>{t.contact.optionB2B}</option>
                          <option>{t.contact.optionB2C}</option>
                          <option>{t.contact.optionGeneral}</option>
                      </select>
                  </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold text-slate-300">
                      {isTalent ? t.contact.labelMessageTalent : t.contact.labelMessage}
                    </label>
                    <textarea name="message" id="message" rows={5} required className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-4 text-slate-50 transition-all outline-none resize-none" placeholder={isTalent ? t.contact.placeholderMessageTalent : t.contact.placeholderMessage}></textarea>
                </div>

                {error && (
                  <div className="p-5 bg-red-500/10 border-2 border-red-500/30 rounded-2xl flex items-start gap-4 animate-[shake_0.5s_ease-in-out]">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-red-500 font-bold text-sm mb-1 uppercase tracking-wider">Error de Envío</h4>
                      <p className="text-red-400 text-sm leading-relaxed">{error}</p>
                    </div>
                  </div>
                )}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-8 py-4 md:py-5 rounded-lg font-bold text-sm md:text-xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    isTalent ? t.contact.buttonSubmitTalent : t.contact.buttonSubmit
                  )}
                </button>
                <div className="text-center">
                    <p className="text-xs text-slate-500">{t.contact.privacyNote}</p>
                </div>
            </form>
          )}
      </section>

      {!isTalent && (
        <div className="text-center mb-32 group">
            <p className="text-slate-500 mb-6 font-bold uppercase tracking-[0.2em] text-xs">{t.contact.directLabel}</p>
              <a 
                href="https://calendly.com/alejandroschultz23/ts360-discovery-con-empresas-30-min" 
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
