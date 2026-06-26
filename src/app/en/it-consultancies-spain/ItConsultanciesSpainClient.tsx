'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, CheckCircle2, ShieldAlert, Zap, Layers, RefreshCw } from 'lucide-react';

export default function ItConsultanciesSpainClient() {
  const { t } = useLanguage();

  // Read translations dynamically
  const trans = t.itConsultancies;

  const features = [
    { 
      title: trans.audience1Title, 
      desc: trans.audience1Desc, 
      icon: <Layers className="w-6 h-6 text-indigo-400" /> 
    },
    { 
      title: trans.audience2Title, 
      desc: trans.audience2Desc, 
      icon: <ShieldAlert className="w-6 h-6 text-indigo-400" /> 
    },
    { 
      title: trans.audience3Title, 
      desc: trans.audience3Desc, 
      icon: <Zap className="w-6 h-6 text-indigo-400" /> 
    },
  ];

  return (
    <div className="flex flex-col bg-slate-950 text-slate-300">
      
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
                {trans.badge}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight tracking-tight">
              {trans.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
              {trans.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 group shadow-xl shadow-indigo-600/10"
              >
                {trans.ctaPilot}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/methodology"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-50 rounded-xl font-medium text-base transition-all flex items-center justify-center"
              >
                {trans.ctaMethodology}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="bg-slate-900/30 border-y border-slate-900 py-24">
        <div className="max-w-base">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">{trans.sectionAudienceTitle}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">{trans.sectionAudienceSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, index) => (
              <div key={index} className="p-8 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between group hover:border-indigo-500/30 transition-all">
                <div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg w-fit mb-6">
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* White-Label Sourcing Motor */}
      <section className="py-24">
        <div className="max-w-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">{trans.sectionWhiteLabelTitle}</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                {trans.sectionWhiteLabelDesc}
              </p>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 h-9 w-9 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{trans.bullet1Title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{trans.bullet1Desc}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 h-9 w-9 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{trans.bullet2Title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{trans.bullet2Desc}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 h-9 w-9 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{trans.bullet3Title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{trans.bullet3Desc}</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="p-8 lg:p-12 bg-slate-900/30 border border-slate-800 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[80px]" />
              <h3 className="text-xl font-bold text-white mb-8">{trans.screenTitle}</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{trans.screenBullet1}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{trans.screenBullet2}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{trans.screenBullet3}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{trans.screenBullet4}</span>
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
            <h2 className="text-3xl font-bold text-white mb-4">{trans.processTitle}</h2>
            <p className="text-slate-400 max-w-2xl">{trans.processSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="text-indigo-400 font-mono text-sm mb-6">{trans.step1Label}</div>
              <h3 className="text-lg font-bold text-white mb-3">{trans.step1Title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{trans.step1Desc}</p>
            </div>
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="text-indigo-400 font-mono text-sm mb-6">{trans.step2Label}</div>
              <h3 className="text-lg font-bold text-white mb-3">{trans.step2Title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{trans.step2Desc}</p>
            </div>
            <div className="p-8 bg-indigo-950/10 border border-indigo-500/20 rounded-2xl">
              <div className="text-indigo-400 font-mono text-sm mb-6">{trans.step3Label}</div>
              <h3 className="text-lg font-bold text-white mb-3">{trans.step3Title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{trans.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-slate-950 border-t border-slate-900 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-white mb-8">
            {trans.ctaTitle}
          </h2>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            {trans.ctaDesc}
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
          >
            {trans.ctaButton}
          </Link>
        </div>
      </section>

    </div>
  );
}
