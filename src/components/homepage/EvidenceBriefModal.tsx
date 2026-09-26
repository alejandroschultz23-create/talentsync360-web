'use client';

import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, Calendar, MapPin, CheckCircle, Compass, ArrowRight } from 'lucide-react';
import EvidenceStateBadge from './EvidenceStateBadge';

interface EvidenceBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EvidenceBriefModal({ isOpen, onClose }: EvidenceBriefModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard accessibility: Escape closes & Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    // Body scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="brief-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Window */}
      <div
        ref={modalRef}
        className="relative w-full h-full sm:h-auto sm:max-h-[88vh] max-w-4xl bg-slate-900 border border-slate-800 rounded-none sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 z-10"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[11px] font-semibold tracking-wider uppercase">
              CANDIDATE EVIDENCE BRIEF
            </span>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-slate-800/80 text-slate-400 font-mono text-[11px]">
              REF: AR-8821
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open('#', '_self')}
              className="text-xs text-slate-400 hover:text-slate-200 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
              title="Dedicated route planned for Gate 4"
            >
              <span>Dedicated View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Close Evidence Brief Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Synthetic Data Disclaimer Banner */}
        <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between shrink-0">
          <p className="text-[11px] font-mono text-amber-300 font-medium">
            [ ILLUSTRATIVE SAMPLE — FICTIONAL CANDIDATE DATA ]
          </p>
          <span className="text-[10px] text-amber-400/80 font-sans hidden md:inline">
            Demonstrates structured decision support format
          </span>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">Target Role</span>
              <span className="font-semibold text-slate-100 text-sm">Sr. Distributed Systems Engineer</span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">Location & Zone</span>
              <span className="font-semibold text-slate-100 text-sm flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                LATAM (UTC-3 / Argentina)
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">Availability</span>
              <span className="font-semibold text-slate-100 text-sm flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                2 Weeks Notice
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">Verification Status</span>
              <span className="font-semibold text-slate-100 text-sm flex items-center gap-1 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Human Review Complete
              </span>
            </div>
          </div>

          {/* Role Context Alignment */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Validated Role Context</h4>
            <div className="p-4 rounded-xl bg-slate-950/30 border border-slate-800 text-slate-300 text-xs sm:text-sm">
              <p>
                <strong className="text-slate-100 font-semibold">Core Stack:</strong> Go (Golang), Apache Kafka, PostgreSQL, AWS (EKS / RDS).
              </p>
              <p className="mt-1">
                <strong className="text-slate-100 font-semibold">Operational Context:</strong> High-throughput event ingestion (&gt; 15,000 msg/sec), US-East timezone overlap, async team communication.
              </p>
            </div>
          </div>

          {/* 3-Column Evidence Breakdown: Strengths, Gaps, Unknowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Strengths */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">Strengths</span>
                <EvidenceStateBadge state="SUPPORTED" size="sm" />
              </div>
              <ul className="text-xs space-y-2 text-slate-300 list-disc list-inside">
                <li>Production Go microservices with robust concurrency patterns (`sync.Pool`, channel pipelines).</li>
                <li>Custom Kafka consumer rebalancer reducing rebalance latency by 35%.</li>
                <li>Clear architectural documentation and attributable code samples.</li>
              </ul>
            </div>

            {/* Column 2: Calibrated Gaps */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">Calibrated Gaps</span>
                <EvidenceStateBadge state="PARTIAL" size="sm" />
              </div>
              <ul className="text-xs space-y-2 text-slate-300 list-disc list-inside">
                <li>Primary cloud deployment is AWS; minimal direct exposure to GCP Pub/Sub.</li>
                <li>Experience centered on single-region clusters; multi-region active-active failover unconfirmed.</li>
              </ul>
            </div>

            {/* Column 3: Surface Unknowns */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-700/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Unknowns</span>
                <EvidenceStateBadge state="UNKNOWN" size="sm" />
              </div>
              <ul className="text-xs space-y-2 text-slate-400 list-disc list-inside">
                <li>No observable artifact for custom Kubernetes Operator development (CRDs).</li>
                <li>Specific database migration rollbacks under zero-downtime SLA not documented.</li>
              </ul>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
                Note: UNKNOWN is not failure. Marked for focused interview inquiry.
              </div>
            </div>
          </div>

          {/* Live Interview Validation Priorities */}
          <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-mono font-bold uppercase text-violet-300 tracking-wider">
                  Priority Interview Validation Questions
                </span>
              </div>
              <EvidenceStateBadge state="NEEDS_VALIDATION" size="sm" />
            </div>

            <div className="space-y-3 pt-1">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <p className="text-xs font-semibold text-slate-200">
                  Question 1: Kafka Partitioning &amp; Rebalancing Strategy
                </p>
                <p className="text-xs text-slate-400 mt-1 italic">
                  &ldquo;In your custom consumer group implementation, what specific backpressure metrics triggered partition reassignment, and how did you prevent consumer lag cascades?&rdquo;
                </p>
                <span className="block mt-1.5 text-[10px] font-mono text-violet-400">
                  Target: Clarify boundary between partial sample and full high-throughput production failover.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <p className="text-xs font-semibold text-slate-200">
                  Question 2: State Synchronization during Rolling EKS Deployments
                </p>
                <p className="text-xs text-slate-400 mt-1 italic">
                  &ldquo;When updating stateful Go workers on Kubernetes, how did you manage in-flight transactions to avoid duplicate event execution?&rdquo;
                </p>
                <span className="block mt-1.5 text-[10px] font-mono text-violet-400">
                  Target: Address unobserved Kubernetes lifecycle state.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            Evidence Briefs are delivered for every finalist before the interview.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              Close Preview
            </button>
            <a
              href="/contact?intent=validate-role"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
            >
              <span>Validate a Role</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
