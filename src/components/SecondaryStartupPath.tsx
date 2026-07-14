'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function SecondaryStartupPath() {
  const { t } = useLanguage();
  const startup = t.home.secondaryStartup;

  return (
    <section className="py-16 bg-slate-900/10 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 md:p-12 border border-white/5 rounded-2xl bg-slate-900/20 backdrop-blur-sm max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-slate-200 mb-3">
            {startup.title}
          </h3>
          <p className="text-sm text-slate-400 font-light leading-relaxed mb-6 max-w-2xl mx-auto">
            {startup.desc}
          </p>
          <div>
            <Link
              href="/companies"
              className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold text-slate-300 hover:text-slate-100 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200"
            >
              {startup.cta}
              <svg className="w-3.5 h-3.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
