'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function FinalCTA() {
  const { t } = useLanguage();
  const cta = t.home.finalCta;

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">

        <div className="p-8 md:p-16 border border-white/5 rounded-3xl bg-slate-900/20 backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-4">
            {cta.title}
          </h2>

          <p className="text-slate-400 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
            {cta.desc}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/contact?intent=shortlist-sprint"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98"
            >
              {cta.cta}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
