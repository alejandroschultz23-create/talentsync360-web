'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, CheckCircle2, Globe, Clock, ShieldCheck, Sparkles, Database, Activity } from 'lucide-react';
import FAQAccordion from '@/components/FAQAccordion';

const ROLES = [
  { name: "React / Next.js Developer", desc: "Frontend architectures and modern responsive web interfaces.", icon: <Globe className="w-5 h-5 text-indigo-400" /> },
  { name: "Node.js / TypeScript Engineer", desc: "Scalable backend systems, microservices, and API optimization.", icon: <Database className="w-5 h-5 text-indigo-400" /> },
  { name: "Python / AI / Data Engineer", desc: "LLM integrations, automation pipelines, and data processing.", icon: <Sparkles className="w-5 h-5 text-indigo-400" /> },
  { name: "DevOps / SRE Specialist", desc: "Cloud infrastructure management, CI/CD pipelines, and stability.", icon: <Activity className="w-5 h-5 text-indigo-400" /> },
];

const FAQS = [
  {
    q: "Why should a company hire nearshore developers from Latin America?",
    a: "Latin American nearshore developers offer full timezone alignment with North American and European operations (EST/CST/GMT). This eliminates communication delays associated with offshore async teams, allowing real-time collaboration during regular working hours."
  },
  {
    q: "How does TalentSync360 evaluate candidate qualifications?",
    a: "Every candidate undergoes a structured screening funnel, including an English communication screening, role-specific practical tasks evaluated against technical screening criteria, and soft-skills alignment checks. Results are delivered as evidence-backed scorecards."
  },
  {
    q: "What is a 72-Hour Sourcing Sprint?",
    a: "A Sourcing Sprint is a rapid technical recruitment cycle where TalentSync360 maps requirements and delivers a curated shortlist of 3 to 5 screened developers within 72 hours of request validation."
  },
  {
    q: "What is the fee structure for a Sourcing Sprint?",
    a: "Our model is based on a flat Sourcing Sprint fee of $1,250, which is 100% creditable toward the final hire, ensuring low risk and clear operational pricing."
  }
];

export default function NearshoreDevelopersLatamClient() {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col bg-slate-950 text-slate-300">
      
      {/* Dynamic Translation Notice */}
      {lang === 'es' && (
        <div className="max-w-base mx-auto mt-6 px-4 w-full relative z-20">
          <div className="bg-blue-600/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-2xl text-xs font-mono text-center">
            Versión en español próximamente. Mostrando versión original en inglés.
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 pt-20 pb-20 lg:pt-32 lg:pb-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-base relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md mb-8">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                LATAM Nearshore Sourcing
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight tracking-tight">
              Top-tier LATAM Senior Talent in Your Timezone.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
              Technical-first matching. Human-screened candidates. 72-hour shortlist delivery.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 group shadow-xl shadow-indigo-600/10"
              >
                Request a Shortlist
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/methodology"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-50 rounded-xl font-medium text-base transition-all flex items-center justify-center"
              >
                See Our Vetting Standard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="bg-slate-900/30 border-y border-slate-900 py-24">
        <div className="max-w-base">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Who This Is For</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Tailored sourcing pipelines for tech organizations demanding timezone alignment and senior talent.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-4">US & EU Startups</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Extend your team without async friction. Work in overlapping timezones with senior software developers who integrate seamlessly into daily standups and Slack channels.
              </p>
            </div>
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-4">Scaling Tech Teams</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Bypass resume screening overhead. Receive candidate shortlists accompanied by comprehensive, evidence-backed scorecards and technical screening criteria signals.
              </p>
            </div>
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-4">IT Consultancies</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Deploy white-label sourcing support to back client overflows. Confirm capability and receive pre-screened talent options on a transparent, flat-fee sprint basis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nearshore Advantages */}
      <section className="py-24">
        <div className="max-w-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">The LATAM Nearshore Advantage</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Hiring developers in Latin America offers structural advantages for European and North American technology teams looking to scale operational velocity.
              </p>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 h-9 w-9 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Timezone Overlap</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">Enjoy 6 to 8 hours of daily overlap. Real-time collaboration eliminates project blockages.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 h-9 w-9 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Cultural Symmetry</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">Highly compatible work ethics, proactive communication standards, and familiarity with modern agile frameworks.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 h-9 w-9 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Premium Technical Hubs</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">Access tech ecosystems in Argentina, Colombia, Brazil, and Uruguay, where senior talent builds global SaaS platforms.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="p-8 lg:p-12 bg-slate-900/30 border border-slate-800 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[80px]" />
              <h3 className="text-xl font-bold text-white mb-8">What We Screen Before Shortlisting</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Chronology Analysis:</strong> Verifying actual project timelines, code contributions, and role tenures.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span><strong>English Communication Screening:</strong> Objective testing of professional written and spoken English.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Technical Screening Criteria:</strong> Hands-on live reviews, algorithmic checks, and system design challenges.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span><strong>360° Fit Matrix:</strong> Compiling soft-skills, communication signals, and code delivery quality.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Sprint Process */}
      <section className="bg-slate-900/30 border-y border-slate-900 py-24">
        <div className="max-w-base">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">The 72-Hour Shortlist Sprint</h2>
            <p className="text-slate-400 max-w-2xl">High-speed technical recruitment, optimized for certainty.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="text-indigo-400 font-mono text-sm mb-6">01 Intake Mapping</div>
              <h3 className="text-lg font-bold text-white mb-3">Define & Match</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Role requirements and KPIs are defined. We confirm sourcing feasibility and search parameters within 24 hours.</p>
            </div>
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="text-indigo-400 font-mono text-sm mb-6">02 Sourcing & Screening</div>
              <h3 className="text-lg font-bold text-white mb-3">Technical Screening</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Our platform initiates sourcing filters. Senior engineers screen candidates against technical screening criteria and English signals.</p>
            </div>
            <div className="p-8 bg-indigo-950/10 border border-indigo-500/20 rounded-2xl">
              <div className="text-indigo-400 font-mono text-sm mb-6">03 Shortlist Delivery</div>
              <h3 className="text-lg font-bold text-white mb-3">Decision-Ready Profiles</h3>
              <p className="text-slate-300 text-sm leading-relaxed">Receive 3 to 5 finalist profiles within 72 hours, complete with evidence-backed scorecards, technical evaluations, and recorded English checks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Technical Roles */}
      <section className="py-24">
        <div className="max-w-base">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Common LATAM Roles Covered in Shortlist Sprints</h2>
            <p className="text-slate-400 max-w-xl mx-auto">We focus strictly on premium technical profiles ready to deploy directly into production environments.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROLES.map((role) => (
              <div key={role.name} className="p-6 bg-slate-900/20 border border-slate-800 rounded-2xl hover:border-indigo-500/30 transition-all group">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg w-fit mb-6">
                  {role.icon}
                </div>
                <h4 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{role.name}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <FAQAccordion title="Frequently Asked Questions" items={FAQS} />

      {/* Final CTA */}
      <section className="py-32 bg-slate-950 border-t border-slate-900 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-white mb-8">
            Activate Your Sourcing Sprint
          </h2>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            Define your technical requirements. Confirm feasibility with our sourcing team. Receive finalist shortlists.
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
          >
            Get in Touch
          </Link>
        </div>
      </section>

    </div>
  );
}
