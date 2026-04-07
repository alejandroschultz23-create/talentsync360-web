'use client';

import { useState } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  title: string;
  items: FAQItem[];
}

export default function FAQAccordion({ title, items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold text-slate-50 mb-12 text-center tracking-tight">{title}</h2>
            
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div 
                        key={index} 
                        className="border border-white/5 rounded-2xl overflow-hidden bg-slate-900/20 backdrop-blur-sm transition-all hover:border-white/10"
                    >
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                        >
                            <span className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors">
                                {item.q}
                            </span>
                            <span className={`ml-4 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>
                        
                        <div 
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="p-6 pt-0 text-slate-400 leading-relaxed font-light">
                                {item.a}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
}
