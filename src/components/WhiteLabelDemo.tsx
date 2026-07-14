'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function WhiteLabelDemo() {
  const { t } = useLanguage();
  const demo = t.home.demo;

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'internal' | 'client'>('internal');
  const [mounted, setMounted] = useState(false);

  // Guard against hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section id="white-label-demo" className="py-24 bg-slate-950 border-t border-white/5 min-h-[600px] flex items-center justify-center">
        <div className="text-slate-400 font-light">
          {demo.loadingDemo}
        </div>
      </section>
    );
  }

  const currentCandidate = demo.candidates[selectedIdx];

  return (
    <section id="white-label-demo" className="py-24 bg-slate-950 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-4">
            {demo.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-2">
            {demo.title}
          </h2>
          <p className="text-sm text-slate-350 font-normal leading-relaxed max-w-2xl mx-auto mb-4">
            {demo.explanation}
          </p>
          <p className="text-xs font-light text-slate-500">
            {demo.subtitle}
          </p>
        </div>

        {/* Demo Window Container */}
        <div className="border border-white/5 rounded-3xl bg-slate-900/10 backdrop-blur-md overflow-hidden shadow-2xl transition-all duration-300">

          {/* Workspace Top Bar */}
          <div className="px-6 py-4 border-b border-white/5 bg-slate-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              {viewMode === 'client' ? (
                // Fictional Branding visual lead
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-sm">
                    N
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-100 uppercase tracking-wider">NovaTech Consulting</span>
                    <span className="block text-xxs text-emerald-400 font-mono">{demo.clientPortal}</span>
                  </div>
                </div>
              ) : (
                // Internal workspace layout
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    TS
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-200">{demo.workspaceTitle}</span>
                    <span className="block text-xxs text-slate-500 font-mono">{demo.activeBrief}</span>
                  </div>
                </div>
              )}
            </div>

            {/* View Switcher Controls */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-white/5 w-full sm:w-auto" role="tablist" aria-label="View mode switch">
              <button
                role="tab"
                aria-selected={viewMode === 'internal'}
                aria-controls="panel-scorecard"
                onClick={() => setViewMode('internal')}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'internal'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {demo.tabInternal}
              </button>
              <button
                role="tab"
                aria-selected={viewMode === 'client'}
                aria-controls="panel-scorecard"
                onClick={() => setViewMode('client')}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'client'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {demo.tabClient}
              </button>
            </div>
          </div>

          {/* Fictional Job Brief Header (Sub-bar) */}
          <div className="px-6 py-3 bg-slate-900/10 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-slate-400 text-xs uppercase tracking-wider block">{demo.briefContext}</span>
              <span className="text-sm font-semibold text-slate-200">{demo.sampleBrief}</span>
            </div>
            <div className="text-slate-400 text-xs font-light">
              {demo.briefDetails}
            </div>
          </div>

          {/* Main Demo Workspace Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">

            {/* Sidebar: Candidates List */}
            <div className="lg:col-span-4 border-r border-white/5 bg-slate-900/20 divide-y divide-white/5" role="tablist" aria-label="Candidate profiles">
              {demo.candidates.map((cand, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={selectedIdx === idx}
                  aria-controls="panel-scorecard"
                  onClick={() => setSelectedIdx(idx)}
                  className={`w-full p-6 text-left transition-all duration-150 flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                    selectedIdx === idx
                      ? 'bg-slate-800/40 border-l-4 border-blue-500'
                      : 'hover:bg-slate-900/40 border-l-4 border-transparent'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-200 group-hover:text-slate-50 transition-colors flex items-center gap-2">
                      {cand.name}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        {cand.match}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-light">
                      {cand.country} · {cand.timezone} · {cand.exp}
                    </div>
                  </div>
                  <svg className={`w-4 h-4 text-slate-500 transition-transform ${selectedIdx === idx ? 'translate-x-1 text-blue-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Details panel */}
            <div id="panel-scorecard" className="lg:col-span-8 p-8 space-y-6" role="tabpanel">

              {/* Top summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 border border-white/5 rounded-xl bg-slate-950">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">{demo.availability}</span>
                  <span className="text-slate-200 text-sm font-semibold">{currentCandidate.avail}</span>
                </div>
                <div className="p-4 border border-white/5 rounded-xl bg-slate-950">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">{demo.communication}</span>
                  <span className="text-slate-200 text-sm font-semibold">{currentCandidate.comm}</span>
                </div>
                <div className="p-4 border border-white/5 rounded-xl bg-slate-950">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">{demo.vettingStatus}</span>
                  <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {currentCandidate.status}
                  </span>
                </div>
              </div>

              {/* Rationale & Strength */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {demo.labelRationale}
                  </h4>
                  <p className="text-slate-300 text-sm font-light leading-relaxed">
                    {currentCandidate.rationale}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {demo.keyStrength}
                  </h4>
                  <p className="text-slate-300 text-sm font-light leading-relaxed">
                    {currentCandidate.strength}
                  </p>
                </div>
              </div>

              <hr className="border-white/5" />

              {/* Toggle-dependent info */}
              {viewMode === 'internal' ? (
                // INTERNAL VIEW DETAILS
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
                        {demo.labelGap} <span className="text-xxs opacity-80">{demo.internalRisk}</span>
                      </h4>
                      <p className="text-slate-300 text-sm font-light leading-relaxed">
                        {currentCandidate.gap}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        {demo.labelNote}
                      </h4>
                      <p className="text-slate-300 text-sm font-light leading-relaxed italic">
                        {currentCandidate.note}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl border border-rose-500/10 bg-rose-500/5 space-y-3">
                    <h5 className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                      {demo.vettingChecklist}
                    </h5>
                    <ul className="space-y-2 text-xs text-slate-400 font-light">
                      <li className="flex items-center gap-2 text-rose-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        {demo.riskLabel} {currentCandidate.risk}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        {demo.vettingEngineer}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        {demo.languageVerification}
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                // CLIENT VIEW DETAILS
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {demo.labelQuestion} <span className="text-xxs opacity-80">{demo.copyPastePrompt}</span>
                    </h4>
                    <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-300 text-sm font-light leading-relaxed">
                      &quot;{currentCandidate.question}&quot;
                    </div>
                  </div>

                  {/* Action prompt */}
                  <div className="p-6 rounded-2xl border border-white/5 bg-slate-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-xs text-slate-400 block font-light">{demo.readyPrompt}</span>
                      <span className="text-xxs text-slate-500 font-mono">{demo.clientBrandingActive}</span>
                    </div>
                    <button className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors">
                      {demo.btnInterview}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Client presentation note */}
        {viewMode === 'client' && (
          <div className="mt-4 text-center text-xs text-slate-500 font-light">
            {demo.embedNote}
          </div>
        )}

      </div>
    </section>
  );
}
