'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function ShortlistSprint() {
  const { t } = useLanguage();
  const sprint = t.home.sprint;

  return (
    <section className="py-24 bg-slate-900/10 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Info Side */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              {sprint.eyebrow}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 tracking-tight leading-tight">
              {sprint.title}
            </h2>
            <p className="text-lg text-slate-400 font-light leading-relaxed">
              {sprint.desc}
            </p>
            <div>
              <Link
                href="/contact?intent=shortlist-sprint"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98"
              >
                {sprint.cta}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Deliverables Checklist Side */}
          <div className="lg:col-span-5">
            <div className="p-8 border border-white/5 rounded-3xl bg-slate-900/30 backdrop-blur-sm relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
              <h3 className="text-xl font-semibold text-slate-100 mb-6 flex items-center justify-between">
                <span>{sprint.specsTitle}</span>
                <span className="text-xs font-mono text-blue-400">{sprint.specsStatus}</span>
              </h3>

              <ul className="space-y-4">
                {sprint.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mt-0.5 shrink-0">
                      <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-300 text-sm font-light leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
