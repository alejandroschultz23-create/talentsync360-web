'use client';

import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

const Navbar = () => {
  const { t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center gap-3 flex-shrink-0 group">
                <Image 
                  src="/logo_oficial.png" 
                  alt="TalentSync360" 
                  width={150} 
                  height={36} 
                  className="h-5 md:h-9 w-auto object-contain transition-opacity" 
                  aria-hidden="true" 
                />
                <span className="text-[10px] sm:text-xs md:text-lg tracking-tight md:tracking-[0.15em] text-slate-50 [font-feature-settings:'cv02','cv03','cv04'] uppercase">
                  <span className="font-bold">TalentSync</span>
                  <span className="font-light text-slate-400 ml-0.5">360</span>
                </span>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-baseline space-x-8">
              <Link href="/companies" className="text-slate-400 hover:text-slate-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">{t.nav.companies}</Link>
              <Link href="/talents" className="text-slate-400 hover:text-slate-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">{t.nav.talents}</Link>
              <Link href="/methodology" className="text-slate-400 hover:text-slate-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">{t.nav.methodology}</Link>
              <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-slate-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">{t.nav.contact}</Link>
            </div>
            <LanguageSwitcher />
          </div>
          <div className="md:hidden flex items-center gap-3">
            <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-slate-50 px-3 py-1.5 rounded-md text-xs font-medium transition-colors">{t.nav.contactShort}</Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
