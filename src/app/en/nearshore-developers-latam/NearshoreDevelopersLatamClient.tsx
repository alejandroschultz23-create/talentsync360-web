'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Clock,
  ShieldCheck,
  Sparkles,
  Database,
  Activity,
  Layers,
  Users,
  UserCheck,
  FileText,
  AlertCircle,
  Check,
  Code,
  Smartphone,
  Cpu
} from 'lucide-react';
import { pushGTMEvent } from '@/lib/analytics';
import FAQAccordion from '@/components/FAQAccordion';

const ROLES = [
  {
    name: "React / Next.js Developer",
    desc: "Modern frontend architectures, responsive web applications, and state management.",
    icon: <Globe className="w-5 h-5 text-indigo-400" />
  },
  {
    name: "Node.js / TypeScript Engineer",
    desc: "Scalable backend services, REST/GraphQL APIs, and microservice infrastructure.",
    icon: <Database className="w-5 h-5 text-indigo-400" />
  },
  {
    name: "Python / AI / Data Engineer",
    desc: "Data pipelines, LLM integrations, automated workflows, and backend services.",
    icon: <Sparkles className="w-5 h-5 text-indigo-400" />
  },
  {
    name: "DevOps / Cloud Specialist",
    desc: "AWS/GCP infrastructure, CI/CD automation, Docker/Kubernetes, and system reliability.",
    icon: <Activity className="w-5 h-5 text-indigo-400" />
  },
  {
    name: "Mobile Developer (React Native / Flutter)",
    desc: "Cross-platform iOS and Android mobile development with clean native integrations.",
    icon: <Smartphone className="w-5 h-5 text-indigo-400" />
  },
  {
    name: "QA Automation Engineer",
    desc: "End-to-end test automation frameworks, integration testing, and regression suites.",
    icon: <Cpu className="w-5 h-5 text-indigo-400" />
  },
];

const EVIDENCE_STATES = [
  {
    state: "VERIFIED",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    description: "Independently checked through a defined verification procedure or credential check."
  },
  {
    state: "OBSERVED",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    description: "Demonstrated technical capability or communication directly observed during the challenge and technical defense."
  },
  {
    state: "SELF-REPORTED",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    description: "Candidate-provided project history, seniority scope, or experience that has not been independently corroborated."
  },
  {
    state: "INFERRED",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    description: "Reasoned technical conclusion derived from available project evidence and architectural discussion."
  },
  {
    state: "CONTRADICTORY",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    description: "Conflicting data points or timelines flagged for explicit exploration during client interviews."
  },
  {
    state: "UNKNOWN",
    badgeColor: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    description: "Unassessed or uncorroborated areas requiring client evaluation before a hiring decision."
  }
];

const FAQS = [
  {
    q: "How does hiring nearshore developers through TalentSync360 work?",
    a: "You provide an active technical role brief with must-have requirements and stack expectations. We confirm search feasibility within 24 hours, initiate AI-assisted semantic discovery, conduct professional evidence reviews, administer a role-specific technical challenge, and execute a technical defense of up to 30 minutes. You receive a structured Evidence Pack and comparable candidate shortlist to conduct final interviews and make the hiring decision."
  },
  {
    q: "How does the 72-hour Shortlist Sprint delivery target work?",
    a: "The 72-hour timeline is a target delivery SLA that commences once your role brief and search parameters have been calibrated and confirmed as feasible. For standard mid-to-senior technical roles, we deliver 3 to 5 validated profiles within 72 hours. Specialized, highly constrained, or executive roles may require an extended sourcing window."
  },
  {
    q: "What is an Evidence Pack, and what does it include?",
    a: "An Evidence Pack is a structured evaluation deliverable for each shortlisted candidate. It includes a requirement-by-requirement evidence matrix, technical challenge results, observations from the 30-minute technical defense, communication signals, explicit evidence states (VERIFIED, OBSERVED, SELF-REPORTED, INFERRED, CONTRADICTORY, UNKNOWN), transparent strengths and gaps, and tailored interview questions for your hiring team."
  },
  {
    q: "How does TalentSync360 validate technical capability and English communication?",
    a: "Candidates undergo a hands-on, role-specific practical challenge evaluated against calibrated technical rubrics, followed by an up to 30-minute technical defense with TalentSync360 to assess architectural reasoning, code decisions, and technical tradeoffs. Professional English communication is evaluated as observed interaction during this live defense."
  },
  {
    q: "What is the fee structure for a Shortlist Sprint?",
    a: "Our model is based on a Shortlist Sprint fee of $1,250 per brief in US outbound trials, where the fee may be credited toward a follow-on engagement if both sides continue."
  },
  {
    q: "Can we source multiple nearshore roles simultaneously?",
    a: "Yes. You can initiate multiple concurrent Shortlist Sprints for different roles (e.g., Frontend, Backend, and DevOps). Each role undergoes independent calibration, technical challenge design, and validation. TalentSync360 provides evaluated shortlists; project management, delivery ownership, and direct contractor/employee relationships remain with your organization."
  }
];

export default function NearshoreDevelopersLatamClient() {
  const { lang } = useLanguage();

  const handleCtaClick = (label: string, location: string, destination: string) => {
    pushGTMEvent('click_request_shortlist', {
      cta_label: label,
      cta_location: location,
      destination: destination,
      language: 'en',
      page_path: '/en/nearshore-developers-latam',
    });
  };

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
              Hire vetted nearshore developers and technical talent in Latin America.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
              Access LATAM software engineers through structured Shortlist Sprints. Every candidate is evaluated through a role-specific technical challenge and up to 30-minute technical defense, delivered with evidence-backed scorecards that show verified capabilities, known constraints, and remaining client validation points.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                href="/contact?intent=shortlist-sprint"
                onClick={() => handleCtaClick('Request a Shortlist', 'nearshore_hero_primary', '/contact?intent=shortlist-sprint')}
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
            <div className="mt-6 text-sm text-slate-400">
              <Link
                href="/companies"
                className="text-indigo-400 hover:text-indigo-300 underline font-medium transition-colors"
              >
                Compare with our B2B Shortlist Sprint packages →
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
            <p className="text-slate-400 max-w-2xl mx-auto">
              Purpose-built technical sourcing pipelines for engineering teams requiring timezone alignment, direct collaboration, and auditable candidate evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 w-fit mb-6">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">US & EU Startups</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Scale development velocity with 4–6+ hours of daily working-hour overlap. Integrate LATAM software engineers directly into your daily standups, code reviews, and sprints.
              </p>
            </div>
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 w-fit mb-6">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Scaling Tech Teams</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Bypass unstructured resume screening. Receive standardized candidate shortlists supported by role-specific technical evaluations and traceable evidence states.
              </p>
            </div>
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 w-fit mb-6">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">IT Consultancies</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Deploy white-label candidate intelligence to back client delivery requirements. Validate technical capabilities quickly on a predictable, flat-fee sprint basis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Hiring Works — Complete Process */}
      <section className="py-24">
        <div className="max-w-base">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How Hiring Nearshore Developers Works
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From calibrated brief to decision-ready shortlist: a structured, evidence-backed evaluation workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="text-indigo-400 font-mono text-xs font-bold mb-4">STEP 01</div>
                <h3 className="text-lg font-bold text-white mb-2">Role Calibration</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  We define must-have technical criteria, stack depth, timezone needs, and evaluation rubrics. Search feasibility is confirmed within 24 hours.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="text-indigo-400 font-mono text-xs font-bold mb-4">STEP 02</div>
                <h3 className="text-lg font-bold text-white mb-2">AI-Assisted Discovery</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  AI assists in semantic talent discovery, mapping candidate career evidence against requirements to prioritize the relevant talent pool.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="text-indigo-400 font-mono text-xs font-bold mb-4">STEP 03</div>
                <h3 className="text-lg font-bold text-white mb-2">Challenge & Defense</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Candidates complete a role-specific practical challenge, followed by an up to 30-minute technical defense to examine reasoning and communication.
                </p>
              </div>
            </div>

            <div className="p-6 bg-indigo-950/20 border border-indigo-500/30 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="text-indigo-400 font-mono text-xs font-bold mb-4">STEP 04</div>
                <h3 className="text-lg font-bold text-white mb-2">Evidence Pack Delivery</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Target delivery of 3–5 candidate profiles within 72 hours of brief validation, complete with evidence matrices, tradeoffs, and interview guides.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="text-indigo-400 font-mono text-xs font-bold mb-4">STEP 05</div>
                <h3 className="text-lg font-bold text-white mb-2">Client Decision</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Your team conducts final interviews using targeted risk questions, makes the final hiring decision, and manages direct employment terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Single Role vs. Multiple-Role Sourcing */}
      <section className="bg-slate-900/30 border-y border-slate-900 py-24">
        <div className="max-w-base">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Single-Role Sprints &amp; Multi-Role Sourcing
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Whether hiring an individual specialist or scaling across multiple roles, TalentSync360 operates on calibrated, role-by-role evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Single Developer Sourcing</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                A focused sprint dedicated to sourcing and validating a specific senior or specialized profile. Ideal for filling critical skill gaps with high certainty and fast turnaround.
              </p>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>One calibrated brief and evaluation rubric</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Target SLA of 72 hours following brief validation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Comparable shortlist of 3 to 5 evaluated finalists</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Multiple-Role Sourcing</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Sourcing across complementary technical roles (e.g., Frontend + Backend + DevOps) managed through distinct, concurrently calibrated briefs.
              </p>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Independent technical challenges and defenses per role</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Individual Evidence Packs for each candidate</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Distinct from managed teams: you maintain delivery ownership</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence Pack v1 & Evidence States */}
      <section className="py-24">
        <div className="max-w-base">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
              Deliverable Transparency
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The TalentSync360 Evidence Pack v1
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We replace superficial resumes with structured candidate evidence. Each profile separates verified facts from observations, self-reports, and uncorroborated areas.
            </p>
          </div>

          {/* Evidence States Grid */}
          <div className="mb-16">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              The 6 Standard Evidence States
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {EVIDENCE_STATES.map((item) => (
                <div key={item.state} className="p-6 bg-slate-900/30 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${item.badgeColor}`}>
                      {item.state}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Pack Breakdown */}
          <div className="p-8 lg:p-12 bg-slate-900/30 border border-slate-800 rounded-3xl">
            <h3 className="text-2xl font-bold text-white mb-6">
              What Each Candidate Profile Contains
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Requirement-by-Requirement Evidence Matrix:</strong> Direct mapping of candidate capabilities against role must-haves.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Technical Defense Evaluation:</strong> Notes from the 30-minute defense detailing architectural reasoning, problem-solving, and code decisions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Observed Communication Signals:</strong> Evaluation of spoken and written English observed during live technical interactions.</span>
                </li>
              </ul>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Explicit Strengths &amp; Gaps:</strong> Balanced overview disclosing both technical competencies and areas requiring client support.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Rate &amp; Availability Constraints:</strong> Dated compensation expectations, available start dates, and verified timezone boundaries.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Tailored Interview Recommendations:</strong> Specific questions designed for your team to probe unvalidated risks and team fit.</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 leading-relaxed">
              * Note: Optional evidence sources (public GitHub repositories, code samples, portfolio projects) are included when available and relevant. The absence of a public profile is treated as an evidence boundary and does not automatically disqualify a candidate.
            </div>
          </div>
        </div>
      </section>

      {/* Technical Validation & 30-Minute Defense */}
      <section className="bg-slate-900/30 border-y border-slate-900 py-24">
        <div className="max-w-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Role-Specific Technical Validation &amp; 30-Minute Defense
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                We do not rely on generic algorithmic puzzles or automated resume parsing. Candidate evaluation is calibrated directly to your brief’s technical reality.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 h-9 w-9 flex items-center justify-center">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Practical Technical Challenge</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Candidates complete a hands-on task reflecting actual production requirements: building an API endpoint, optimizing a database query, or refactoring a UI module.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 h-9 w-9 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Technical Defense (Up to 30 Min)</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      A live technical discussion with TalentSync360 examining why the candidate made specific design choices, how they handle edge cases, and their understanding of technical tradeoffs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 h-9 w-9 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Observed Communication Signals</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      English proficiency is evaluated directly through the candidate’s ability to articulate complex technical ideas and explain engineering reasoning during the defense.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Comparison Table */}
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl">
              <h3 className="text-xl font-bold text-white mb-6">
                Validation Division of Responsibility
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Validated by TalentSync360
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 pl-6 list-disc">
                    <li>Role-specific technical challenge performance</li>
                    <li>Technical reasoning and defense observations</li>
                    <li>Observed English communication during defense</li>
                    <li>Chronology and project timeline consistency</li>
                    <li>Availability and compensation expectations</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Validated by the Client
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 pl-6 list-disc">
                    <li>Proprietary codebase and domain deep-dive</li>
                    <li>Company cultural alignment and team dynamics</li>
                    <li>Final hiring and selection decision</li>
                    <li>Contractual and employment agreements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Boundaries & Client Responsibilities */}
      <section className="py-24">
        <div className="max-w-base">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Clear Service Boundaries
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              TalentSync360 provides specialized technical candidate discovery and evidence-backed shortlists. We operate with strict commercial clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-2">Core Product</span>
                <h3 className="text-xl font-bold text-white mb-4">Shortlist Sprint</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Intake calibration → AI-assisted discovery → technical challenge &amp; defense → Evidence Pack → comparable candidate shortlist.
                </p>
              </div>
              <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
                Shortlist Sprint fee of $1,250 per brief in US outbound trials.
              </div>
            </div>

            <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider block mb-2">Extended Service</span>
                <h3 className="text-xl font-bold text-white mb-4">Full-Cycle Search</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Shortlist Sprint foundation plus interview coordination, feedback loops, pipeline management, and selection support.
                </p>
              </div>
              <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
                Active separate service for extended pipeline needs.
              </div>
            </div>

            <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">Out of Scope</span>
                <h3 className="text-xl font-bold text-white mb-4">What We Do Not Do</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  We are not an Employer of Record (EOR), payroll agency, contractor management platform, or managed staff augmentation provider.
                </p>
              </div>
              <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
                Direct employment and delivery remain client-managed.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LATAM Nearshore Advantages */}
      <section className="bg-slate-900/30 border-y border-slate-900 py-24">
        <div className="max-w-base">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">The LATAM Nearshore Advantage</h2>
            <p className="text-slate-400 max-w-2xl">
              Hiring developers across Latin America offers structural advantages for North American and European engineering teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="flex-shrink-0 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 w-fit mb-6">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Timezone Overlap</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Enjoy 4–6+ hours of daily working overlap aligned with US timezones (EST/CST/PST) and European operations, facilitating synchronous collaboration and fast feedback cycles.
              </p>
            </div>

            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="flex-shrink-0 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 w-fit mb-6">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Established Tech Hubs</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Access established engineering ecosystems in Argentina, Colombia, Brazil, Uruguay, and Mexico, where engineers build scalable SaaS architectures for global companies.
              </p>
            </div>

            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="flex-shrink-0 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 w-fit mb-6">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Agile &amp; Cultural Alignment</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Familiarity with modern product management workflows, distributed agile ceremonies, pull-request reviews, and collaborative problem-solving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Technical Roles */}
      <section className="py-24">
        <div className="max-w-base">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Common LATAM Roles Covered in Shortlist Sprints
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              We source and evaluate candidates across core software development, cloud infrastructure, and data disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            Request a Shortlist Sprint
          </h2>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            Submit your active technical role brief. We will confirm search parameters and feasibility within 24 hours, then deliver an evidence-backed candidate shortlist.
          </p>
          <Link 
            href="/contact?intent=shortlist-sprint"
            onClick={() => handleCtaClick('Submit Your Technical Brief', 'nearshore_final_cta', '/contact?intent=shortlist-sprint')}
            className="inline-block px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
          >
            Submit Your Technical Brief
          </Link>
        </div>
      </section>

    </div>
  );
}
