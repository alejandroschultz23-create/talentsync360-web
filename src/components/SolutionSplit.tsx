"use client";

import React, { useState } from "react";
import { Building2, Rocket, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SolutionModal } from "./SolutionModals";

const SolutionSplit = () => {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<"white-label" | "runway" | null>(null);

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
                {t.home.solutionSplit.consultancyTitle}
              </h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                {t.home.solutionSplit.consultancyDesc}
              </p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  {t.home.solutionSplit.consultancyBullet1}
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  {t.home.solutionSplit.consultancyBullet2}
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  {t.home.solutionSplit.consultancyBullet3}
                </li>
              </ul>
              
              <button 
                onClick={() => setActiveModal("white-label")}
                className="text-indigo-400 font-medium flex items-center gap-2 group-hover:text-indigo-300 transition-colors cursor-pointer"
              >
                {t.home.solutionSplit.consultancyCta}
                <Rocket className="w-4 h-4 text-indigo-500/50" />
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
                {t.home.solutionSplit.startupTitle}
              </h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                {t.home.solutionSplit.startupDesc}
              </p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  {t.home.solutionSplit.startupBullet1}
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  {t.home.solutionSplit.startupBullet2}
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  {t.home.solutionSplit.startupBullet3}
                </li>
              </ul>
              
              <button 
                onClick={() => setActiveModal("runway")}
                className="text-emerald-400 font-medium flex items-center gap-2 group-hover:text-emerald-300 transition-colors cursor-pointer"
              >
                {t.home.solutionSplit.startupCta}
                <Rocket className="w-4 h-4 text-emerald-500/50" />
              </button>
            </div>
          </div>

        </div>

        {/* Modals */}
        <SolutionModal 
          type="white-label"
          isOpen={activeModal === "white-label"}
          onClose={() => setActiveModal(null)}
        />
        <SolutionModal 
          type="runway"
          isOpen={activeModal === "runway"}
          onClose={() => setActiveModal(null)}
        />
      </div>
    </section>
  );
};

export default SolutionSplit;
