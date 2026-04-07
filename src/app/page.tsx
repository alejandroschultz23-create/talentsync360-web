'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[92dvh] px-4 sm:px-6 lg:px-8 text-center overflow-hidden pt-20 [isolation:isolate]">
        {/* Deep Field Background - GPU Optimized */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/5 rounded-[100%] blur-[160px] animate-pulse-gpu"></div>
            <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse-gpu" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-blue-400/5 rounded-full blur-[100px] animate-pulse-gpu" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          {/* Golden Ratio Scale: 0.618 / 1 / 1.618 / 2.618 */}
          
          <div className="flex justify-center mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <span className="px-4 py-1.5 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-blue-400 uppercase bg-blue-500/5 rounded-full border border-blue-400/20 backdrop-blur-sm">
              {t.home.heroBadge}
            </span>
          </div>

          <h1 className="text-hero font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 mb-12 opacity-0 animate-fade-in-up leading-[1.1]" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            {t.home.heroTitle}
          </h1>

          <p className="text-xl sm:text-2xl text-slate-400 mb-20 max-w-2xl mx-auto leading-relaxed font-light opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            {t.home.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            {/* The Focal Point CTA: Punto de Fuga */}
            <Link 
              href="/contact" 
              className="group relative w-full sm:w-auto active:scale-95 transition-transform"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500 animate-luminous"></div>
              <div className="relative flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 animate-shimmer shadow-2xl shadow-blue-600/20">
                <span className="mr-3">{t.home.ctaShortlist}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>

            <Link 
              href="/talents" 
              className="w-full sm:w-auto text-slate-400 hover:text-slate-100 px-10 py-5 rounded-2xl font-bold text-lg transition-all border border-white/5 hover:border-white/10 bg-slate-900/40 backdrop-blur-md hover:bg-slate-900/60 active:scale-95"
            >
              {t.home.ctaGoldList}
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator - Bottom Focal Point */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-bounce">
            <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent"></div>
        </div>
      </section>

      {/* Systematic Pipeline Section */}
      <section className="bg-slate-950 py-32 border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-gpu"></div>
          </div>
          
          <div className="max-w-base mx-auto relative z-10">
              <div className="mb-24 px-4">
                <p className="text-blue-500 font-bold tracking-[0.2em] uppercase text-sm mb-6">{t.home.pipelineTagline}</p>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-50 mb-8 max-w-2xl">{t.home.pipelineTitle}</h2>
                <p className="text-slate-400 font-light max-w-xl">{t.home.pipelineSub}</p>
              </div>
              
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                  {/* Step 1 - Input */}
                  <div className="relative z-10 flex flex-col group">
                    <div className="p-10 md:p-12 bg-slate-900/40 border border-white/5 rounded-[2.5rem] hover:border-blue-500/20 hover:bg-slate-900/60 transition-all backdrop-blur-xl h-full shadow-2xl">
                      <div className="w-12 h-12 bg-blue-600/10 text-blue-500 flex items-center justify-center rounded-xl mb-12 font-bold text-lg border border-blue-500/10">
                         01
                      </div>
                      <div className="text-sm text-blue-400 uppercase tracking-[0.15em] mb-4 font-bold">{t.home.step1Label}</div>
                      <h3 className="text-lg font-bold text-slate-50 mb-6">{t.home.step1Title}</h3>
                      <p className="text-slate-400 font-light leading-[1.7]">{t.home.step1Desc}</p>
                    </div>
                  </div>

                  {/* Step 2 - Process */}
                  <div className="relative z-10 flex flex-col group">
                    <div className="p-10 md:p-12 bg-slate-900/40 border border-white/5 rounded-[2.5rem] hover:border-blue-500/20 hover:bg-slate-900/60 transition-all backdrop-blur-xl h-full shadow-2xl">
                      <div className="w-12 h-12 bg-slate-800/50 text-slate-400 flex items-center justify-center rounded-xl mb-12 font-bold text-lg border border-white/5">
                         02
                      </div>
                      <div className="text-sm text-slate-500 uppercase tracking-[0.15em] mb-4 font-bold">{t.home.step2Label}</div>
                      <h3 className="text-lg font-bold text-slate-50 mb-6">{t.home.step2Title}</h3>
                      <p className="text-slate-400 font-light leading-[1.7]">{t.home.step2Desc}</p>
                    </div>
                  </div>

                  {/* Step 3 - Output */}
                  <div className="relative z-10 flex flex-col group">
                    <div className="p-10 md:p-12 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] hover:border-blue-500/40 hover:bg-blue-600/20 transition-all backdrop-blur-xl h-full shadow-2xl">
                      <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-xl mb-12 font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                         03
                      </div>
                      <div className="text-sm text-blue-400 uppercase tracking-[0.15em] mb-4 font-bold">{t.home.step3Label}</div>
                      <h3 className="text-lg font-bold text-slate-50 mb-6">{t.home.step3Title}</h3>
                      <p className="text-slate-300 font-light leading-[1.7]">{t.home.step3Desc}</p>
                    </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Trust & Proof Section */}
      <section className="py-32 bg-slate-950 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-base mx-auto relative z-10">
            <div className="mb-24 px-4">
              <h2 className="text-blue-500 font-bold tracking-[0.2em] uppercase text-sm mb-6">{t.home.trustTitle}</h2>
              <div className="w-20 h-1 bg-blue-600/30"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
                <div className="group relative">
                    <div className="text-slate-50 text-hero font-bold mb-12 tabular-nums">{t.home.trust1Value}</div>
                    <p className="text-slate-200 font-bold text-lg mb-4">{t.home.trust1Label}</p>
                    <p className="text-slate-500 font-light text-sm leading-relaxed max-w-[280px]">{t.home.trust1Desc}</p>
                    <div className="absolute -bottom-6 left-0 w-0 group-hover:w-full h-px bg-gradient-to-r from-blue-600/50 to-transparent transition-all duration-700"></div>
                </div>
                <div className="group relative">
                    <div className="text-slate-50 text-hero font-bold mb-12 tabular-nums">{t.home.trust2Value}</div>
                    <p className="text-slate-200 font-bold text-lg mb-4">{t.home.trust2Label}</p>
                    <p className="text-slate-500 font-light text-sm leading-relaxed max-w-[280px]">{t.home.trust2Desc}</p>
                    <div className="absolute -bottom-6 left-0 w-0 group-hover:w-full h-px bg-gradient-to-r from-blue-600/50 to-transparent transition-all duration-700"></div>
                </div>
                <div className="group relative">
                    <div className="text-slate-50 text-hero font-bold mb-12 tabular-nums">{t.home.trust3Value}</div>
                    <p className="text-slate-200 font-bold text-lg mb-4">{t.home.trust3Label}</p>
                    <p className="text-slate-500 font-light text-sm leading-relaxed max-w-[280px]">{t.home.trust3Desc}</p>
                    <div className="absolute -bottom-6 left-0 w-0 group-hover:w-full h-px bg-gradient-to-r from-blue-600/50 to-transparent transition-all duration-700"></div>
                </div>
            </div>
        </div>
      </section>

      {/* Final CTA Section: The Echo of the Hero */}
      <section className="py-48 bg-slate-950 relative overflow-hidden">
        {/* Radial Depth Mirroring Hero */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.08)_0%,_transparent_70%)] rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-hero font-bold text-slate-50 mb-8 tracking-tight [text-wrap:balance]">
            {t.home.ctaTitle}
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 font-light mb-16 max-w-2xl mx-auto leading-relaxed">
            {t.home.ctaDesc}
          </p>
          <div className="flex flex-col items-center gap-6">
            <Link 
              href="/contact" 
              className="group relative inline-flex items-center px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl transition-all shadow-2xl shadow-blue-600/40 active:scale-95 animate-shimmer"
            >
              <div className="absolute -inset-1 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-luminous"></div>
              <span className="relative z-10">{t.home.ctaButton}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform duration-500 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-sm font-bold tracking-[0.3em] text-blue-500/50 uppercase">Ready for Deployment</p>
          </div>
        </div>
      </section>
    </div>
  );
}
