'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Layers, Briefcase, Cpu, Flame, Target } from 'lucide-react';

const icons = [Layers, Briefcase, Cpu, Flame, Target];

export default function ICPSection() {
  const { t } = useLanguage();
  const icp = t.home.icp;

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight leading-tight">
            {icp.title}
          </h2>
        </div>

        {/* 5-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {icp.cards.map((card, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={index}
                className={`p-8 border border-white/5 rounded-2xl bg-slate-900/20 backdrop-blur-sm hover:border-blue-500/20 hover:bg-slate-900/35 transition-all duration-300 flex flex-col justify-between ${
                  index >= 3 ? 'lg:col-span-1 lg:first-of-type:ml-auto lg:last-of-type:mr-auto' : ''
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center mb-6 border border-blue-500/20">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">
                    {card.title}
                  </h3>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
