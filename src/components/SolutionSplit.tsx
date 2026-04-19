"use client";

import React from "react";
import { Building2, Rocket, CheckCircle2 } from "lucide-react";

const SolutionSplit = () => {
  return (
    <section className="bg-slate-950 border-y border-slate-900 py-24">
      <div className="max-w-base">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Column 1: Spanish IT Consultancies */}
          <div className="glass-morphism p-8 lg:p-12 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Building2 className="w-32 h-32 text-indigo-500" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">
                For Spanish IT Consultancies
              </h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                TalentSync360 Engine provides white-label nearshore talent. 
                Combat the 80% talent gap in the Spanish market with speed. 
                Shortlists arrive in 72 hours, vetted for agility and technical precision.
              </p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  White-label integration with existing teams
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  Immediate capacity for project overflows
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  Timezone alignment with EEA operations
                </li>
              </ul>
              
              <button className="text-indigo-400 font-medium flex items-center gap-2 group-hover:text-indigo-300 transition-colors">
                View White-Label Terms
                <Rocket className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column 2: US/EU Startups */}
          <div className="glass-morphism p-8 lg:p-12 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Rocket className="w-32 h-32 text-emerald-500" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">
                For US/EU Startups
              </h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                TalentSync360 Engine extends runway. 
                Startups achieve 60% savings compared to local hiring without quality trade-offs. 
                Top 3% LATAM engineers, C1 English verified, ready for high-octane contribution.
              </p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  60% Average reduction in burn rate
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Technical vetting via Senior CTO network
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Flexible contract scaling (Up/Down in 30 days)
                </li>
              </ul>
              
              <button className="text-emerald-400 font-medium flex items-center gap-2 group-hover:text-emerald-300 transition-colors">
                Request Runway Analysis
                <Rocket className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SolutionSplit;
