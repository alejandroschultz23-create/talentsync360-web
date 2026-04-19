"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Globe, Database, Code2, Sparkles, Activity } from "lucide-react";

const SKILLS = [
  { name: "React / Next.js", level: "Senior", count: 124, icon: <Globe className="w-4 h-4" color="#61dbfb" /> },
  { name: "AI / ML Engineering", level: "Expert", count: 42, icon: <Sparkles className="w-4 h-4" color="#10b981" /> },
  { name: "Go / Backend", level: "Senior", count: 68, icon: <Code2 className="w-4 h-4" color="#00add8" /> },
  { name: "Node.js / TypeScript", level: "Arch", count: 156, icon: <Database className="w-4 h-4" color="#339933" /> },
  { name: "Python / Data", level: "Senior", count: 89, icon: <Cpu className="w-4 h-4" color="#3776ab" /> },
  { name: "AWS / DevOps", level: "Senior", count: 74, icon: <Activity className="w-4 h-4" color="#ff9900" /> },
];

const TalentGrid = () => {
  const [engineLoad, setEngineLoad] = useState(82);

  useEffect(() => {
    const interval = setInterval(() => {
      setEngineLoad(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(Math.max(prev + delta, 75), 98);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-slate-950 py-24">
      <div className="max-w-base">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Real-time Talent Pool Velocity
            </h2>
            <p className="text-slate-400">
              The Engine eliminates fixed verticals. Our infrastructure maps talent across 250+ technical parameters, 
              ensuring precision matching based on real engineering contributions.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-md min-w-[200px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-mono">Engine Load</span>
              <span className="text-xs font-mono text-emerald-500">{engineLoad}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${engineLoad}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((skill) => (
            <div key={skill.name} className="glass-morphism p-6 rounded-2xl group hover:border-white/10 transition-all cursor-default">
              <div className="flex justify-between items-start mb-6">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                  {skill.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Available Engine Time</span>
                  <span className="text-sm font-bold text-indigo-400">{skill.count} Profiles</span>
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-white mb-2">{skill.name}</h4>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {skill.level}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Vetted
                </span>
              </div>

              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden group-hover:bg-slate-800 transition-colors">
                <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-full w-2/3" />
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Overlay Placeholder */}
        <div className="mt-12 p-8 border border-dashed border-slate-800 rounded-3xl text-center">
            <p className="text-sm text-slate-500 font-mono animate-pulse">
                SCANNED REGIONS: LATAM-1 (ARG, BRA, COL, MEX) | LATAM-2 (CHL, PER, URY) | TOTAL POOL: 14,281 ENGINEERS
            </p>
        </div>
      </div>
    </section>
  );
};

export default TalentGrid;
