'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { SolutionModal } from '@/components/SolutionModals';

export default function CompaniesClient() {
  const { t, lang } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isEs = lang === 'es';
  const tiers = [
    {
      name: isEs ? "Shortlist Sprint" : "Shortlist Sprint",
      price: "€1,250 / $1,250",
      period: isEs ? "por brief, según mercado" : "per brief, depending on market",
      description: isEs ? "1.250 € por brief en España/UE o $1.250 por brief en pruebas outbound de EE. UU." : "€1,250 per brief in Spain/EU or $1,250 per brief in US outbound trials.",
      candidates: isEs ? "3-5 candidatos senior" : "3-5 senior candidates",
      sla: isEs ? "SLA objetivo para briefs validados" : "Target SLA for validated briefs",
      color: 'slate',
      includes: isEs ? [
        "Diseñado para ciclos de shortlist de 48-72h",
        "Extracción de señales asistida por IA y revisión humana",
        "SLA objetivo de 72h para briefs validados",
        "El fee de piloto puede acreditarse a un engagement de seguimiento",
      ] : [
        "Designed for 48-72h shortlist cycles",
        "AI-assisted signal extraction & human review",
        "Target SLA of 72 hours for validated briefs",
        "Pilot fee may be credited toward a follow-on engagement",
      ],
      guarantee: isEs ? "El fee de piloto puede acreditarse a un engagement de seguimiento" : "Pilot fee may be credited toward a follow-on engagement",
      popular: false,
    },
    {
      name: isEs ? "Piloto de Validación" : "Validation Pilot",
      price: "€2,500 / $2,500",
      period: isEs ? "2 briefs / 30 días" : "2 briefs / 30 days",
      description: isEs ? "2.500 € en España/UE o $2.500 en pruebas outbound en EE. UU. para un piloto de validación de 2 briefs." : "€2,500 in Spain/EU or $2,500 in US outbound trials for a 2-brief validation pilot.",
      candidates: isEs ? "2 briefs concurrentes" : "2 concurrent briefs",
      sla: isEs ? "Piloto de validación de 30 días" : "30-day pilot validation",
      color: 'blue',
      includes: isEs ? [
        "Acelera la entrega de briefs a tus clientes",
        "Diseñado para testear la velocidad del pipeline",
        "Scorecards de candidatos basados en evidencia",
        "El fee del piloto se puede acreditar a un retainer de seguimiento o paquete sprint ampliado si ambas partes continúan",
      ] : [
        "Accelerate client brief delivery response times",
        "Designed for testing pipeline velocity",
        "Evidence-backed candidate scorecards & vetting",
        "Pilot fee can be credited toward a follow-on retainer or expanded sprint package if both sides continue",
      ],
      guarantee: isEs ? "El fee del piloto se puede acreditar a un retainer de seguimiento o paquete sprint ampliado si ambas partes continúan" : "Pilot fee can be credited toward a follow-on retainer or expanded sprint package if both sides continue",
      popular: true,
    }
  ];

  const roles = t.companies.professionalRoles;

  return (
    <div className="flex flex-col">
      <section className="bg-slate-950 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="text-blue-500 font-medium mb-4 block uppercase tracking-widest text-sm">{t.companies.badge}</span>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-6 tracking-tight leading-[1.15]">
                {t.companies.title.split('.')[0]}.<br className="hidden md:block" /> {t.companies.title.split('.')[1]?.trim()}.
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                {t.companies.subtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-slate-50 px-8 py-3 rounded-md font-bold text-lg transition-colors shadow-lg shadow-blue-600/20"
                >
                  {t.companies.ctaShortlist}
                </button>
                <Link href="/methodology" className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-slate-50 px-8 py-3 rounded-md font-medium text-lg transition-colors">{t.companies.ctaMethodology}</Link>
            </div>
        </div>
      </section>

      <section className="bg-slate-900/50 py-24 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-50 mb-4">{t.companies.tiersTitle}</h2>
              <p className="text-slate-500 max-w-xl mx-auto">{t.companies.tiersSubtitle}</p>
            </div>
            
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {tiers.map((tier) => (
                    <div key={tier.name} className={`relative p-8 bg-slate-950 border rounded-xl transition-all flex flex-col justify-between ${tier.popular ? 'border-blue-500/50 shadow-[0_0_30px_rgba(37,99,235,0.15)]' : 'border-slate-800 hover:border-slate-700'}`}>
                        {tier.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">Most Popular</div>
                        )}
                        <div>
                          <div className="text-center mb-6">
                            <h3 className={`text-2xl font-bold mb-2 ${tier.color === 'blue' ? 'text-blue-400' : 'text-slate-300'}`}>{tier.name}</h3>
                            <div className="flex flex-col items-center justify-center mb-1">
                              <span className="text-4xl font-bold text-white">{tier.price}</span>
                              <span className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{tier.period}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 mb-4 italic max-w-xs mx-auto leading-relaxed">{tier.description}</p>
                            <div className="text-sm text-slate-500 font-mono mt-3">{tier.candidates} · {tier.sla}</div>
                          </div>
                          <ul className="space-y-3 mb-6">
                            {tier.includes.map((item) => (
                              <li key={item} className="flex items-start text-sm text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-4 border-t border-slate-800">
                           <p className="text-xs text-slate-500">{tier.guarantee}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      <section className="bg-slate-900/50 py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-50 mb-4">{t.companies.rolesTitle}</h2>
              <p className="text-slate-500">{t.companies.rolesSubtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map((role) => (
                    <div key={role.title} className="p-8 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500/30 transition-all group">
                        <h3 className="text-xl font-bold text-slate-50 mb-3 group-hover:text-blue-400 transition-colors">{role.title}</h3>
                        <p className="text-sm text-slate-400 mb-6">{role.desc}</p>
                        <div className="pt-4 border-t border-white/5 flex flex-col space-y-2">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Primary KPIs:</span>
                            <p className="text-xs text-blue-500 font-mono italic">{role.kpis}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      <section className="py-32 bg-slate-950">
        <div className="max-w-4xl mx-auto text-center px-4">
            <div className="p-16 bg-blue-600 rounded-3xl flex flex-col items-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 relative z-10">{t.companies.ctaTitle}</h2>
                <p className="text-white/80 max-w-xl mb-10 relative z-10 text-lg">{t.companies.ctaDesc}</p>
                <Link 
                  href="https://calendly.com/alejandroschultz23/ts360-discovery-con-empresas-30-min" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 bg-white text-blue-600 px-10 py-5 rounded-md font-bold text-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  {t.companies.ctaButton}
                </Link>
            </div>
        </div>
      </section>
      <SolutionModal 
        type="runway"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
