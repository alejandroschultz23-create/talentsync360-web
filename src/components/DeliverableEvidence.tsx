'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function DeliverableEvidence() {
  const { t } = useLanguage();
  const evidence = t.home.evidence;

  return (
    <section className="py-24 bg-slate-900/10 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Deliverable Evidence
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight leading-tight">
              {evidence.title}
            </h2>
            <p className="text-slate-400 font-light leading-relaxed">
              We compile structured evidence for every finalist candidate. Instead of generic CVs, your delivery managers receive a complete decision package containing raw vetting signals, enabling you to present verified technical capability to your final client.
            </p>
            <div className="p-4 rounded-xl border border-white/5 bg-slate-950/40 text-xs text-slate-500 leading-relaxed font-light">
              We focus on presenting verified signals. TalentSync360 does not provide automated candidate selection, perfect matches, or guaranteed levels of English. All profiles are human-reviewed to support your own delivery decisions.
            </div>
          </div>

          {/* List Grid Side */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {evidence.items.map((item: string, index: number) => (
              <div
                key={index}
                className="p-5 rounded-2xl border border-white/5 bg-slate-900/20 hover:border-white/10 transition-colors flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mt-0.5 shrink-0">
                  <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-200 text-sm font-light leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
