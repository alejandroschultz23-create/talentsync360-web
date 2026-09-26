'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import EvidenceStateBadge, { EvidenceState } from './EvidenceStateBadge';

interface StateDetail {
  title: string;
  definition: string;
  exampleContext: string;
  interviewAction: string;
  state: EvidenceState;
}

const STATE_DETAILS: Record<EvidenceState, StateDetail> = {
  SUPPORTED: {
    state: 'SUPPORTED',
    title: 'Supported State',
    definition: 'Observable or attributable evidence supports the capability relevant to the specified role requirement.',
    exampleContext: 'Production code commits, repository pull requests, or architecture design documents show hands-on implementation of Go event consumers.',
    interviewAction: 'Interviewers can build directly on proven competency and explore high-level system trade-offs rather than validating basic syntax.',
  },
  PARTIAL: {
    state: 'PARTIAL',
    title: 'Partial State',
    definition: 'Foundational, adjacent, or bounded evidence is available, but the depth or comparable context required by the role remains unconfirmed.',
    exampleContext: 'Candidate has extensive relational database optimization experience, but direct production workload with the specific cloud engine (e.g. AWS Aurora) is unconfirmed.',
    interviewAction: 'Interviewers dedicate 5 minutes to verify adaptability and speed of transfer to the target environment.',
  },
  UNKNOWN: {
    state: 'UNKNOWN',
    title: 'Unknown State (Strictly Non-Punitive)',
    definition: 'The available evidence does not support a conclusion. Missing evidence is not failure; it simply highlights an area for live interview discussion.',
    exampleContext: 'No observable artifact demonstrates direct exposure to custom Kubernetes CRD development. The candidate simply did not submit that specific project.',
    interviewAction: 'UNKNOWN triggers a targeted validation question. Zero score penalty is assessed beforehand.',
  },
  CONFLICT: {
    state: 'CONFLICT',
    title: 'Conflict State',
    definition: 'Two or more available sources provide materially inconsistent information that cannot currently be reconciled.',
    exampleContext: 'Candidate summary notes primary hands-on ownership of high-load Kafka clustering, but provided project writeup describes another lead engineer maintaining the infrastructure.',
    interviewAction: 'Interviewers directly clarify architectural ownership boundaries during the technical discussion.',
  },
  NEEDS_VALIDATION: {
    state: 'NEEDS_VALIDATION',
    title: 'Needs Validation State',
    definition: 'A relevant question requires additional evidence or live human discussion before a conclusion can be made.',
    exampleContext: 'Candidate has strong asynchronous messaging experience, but the role specifically requires zero-downtime rolling upgrades under high continuous throughput.',
    interviewAction: 'Becomes a top-priority live question in the Candidate Evidence Brief, complete with recommended interviewer prompts.',
  },
};

export default function Section07EvidenceStates() {
  const [selectedState, setSelectedState] = useState<EvidenceState>('UNKNOWN');
  const activeDetail = STATE_DETAILS[selectedState];

  return (
    <section className="py-20 md:py-28 bg-[#0b0f19] border-b border-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400 block">
            OUR EVALUATION STANDARD
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Missing evidence is not a negative conclusion.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-normal">
            Traditional screening often treats an absent keyword as disqualification. TalentSync360 structures signals into five clear states so interviewers know what is verified and what remains to be discussed.
          </p>
        </div>

        {/* 5 States Horizontal Selector Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {(['SUPPORTED', 'PARTIAL', 'UNKNOWN', 'CONFLICT', 'NEEDS_VALIDATION'] as EvidenceState[]).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`p-1 rounded-lg transition-all ${
                selectedState === st
                  ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0b0f19] scale-105'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <EvidenceStateBadge state={st} size="md" />
            </button>
          ))}
        </div>

        {/* Interactive Active State Deep-Dive Panel */}
        <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Active State</span>
              <h3 className="text-lg font-bold text-white">{activeDetail.title}</h3>
            </div>
            <EvidenceStateBadge state={activeDetail.state} size="lg" />
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Canonical Semantic Meaning
              </span>
              <p className="text-sm text-slate-200 font-normal leading-relaxed">
                {activeDetail.definition}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 block">
                Real-World Evaluation Scenario
              </span>
              <p className="text-xs sm:text-sm text-slate-300 italic">
                &ldquo;{activeDetail.exampleContext}&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 block">
                Impact on the Human Interview
              </span>
              <p className="text-xs sm:text-sm text-slate-300">
                {activeDetail.interviewAction}
              </p>
            </div>
          </div>

          {/* Epistemic Callout */}
          <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 font-mono">
            UNKNOWN remains UNKNOWN. TalentSync360 does not infer negative conclusions from absent evidence.
          </div>
        </div>

        {/* Link to Methodology */}
        <div className="mt-12 text-center">
          <Link
            href="/methodology"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group"
          >
            <span>How Evidence Works in our full methodology</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
