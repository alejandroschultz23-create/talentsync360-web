'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { pushGTMEvent } from '@/lib/analytics';

export default function Navbar() {
  const { t, lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleValidateRoleClick = (location: string) => {
    pushGTMEvent('click_contact', {
      cta_label: 'Validate a Role',
      cta_location: location,
      destination: '/contact?intent=validate-role',
      language: lang,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/85 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0" aria-label="TalentSync360 Home">
              <div className="relative w-[170px] sm:w-[200px] h-8 sm:h-9">
                <Image
                  src="/logo_horizontal.png"
                  alt="TalentSync360"
                  fill
                  sizes="(min-width: 640px) 200px, 170px"
                  className="object-contain object-left transition-opacity hover:opacity-90"
                  priority
                  unoptimized
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7">
            <div className="flex items-center space-x-6 text-xs sm:text-sm font-medium text-slate-300">
              <a
                href="#product-transformation"
                className="hover:text-white transition-colors"
              >
                {t.nav.product}
              </a>
              <Link
                href="/companies"
                className="hover:text-white transition-colors"
              >
                {t.nav.forCompanies}
              </Link>
              <Link
                href="/talents"
                className="hover:text-white transition-colors"
              >
                {t.nav.forTalent}
              </Link>
              <Link
                href="/contact?intent=partner-delivery"
                className="hover:text-white transition-colors"
              >
                {t.nav.partners}
              </Link>
              <Link
                href="/methodology"
                className="hover:text-white transition-colors"
              >
                {t.nav.methodology}
              </Link>
            </div>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <LanguageSwitcher />

              <Link
                href="/contact?intent=validate-role"
                onClick={() => handleValidateRoleClick('navbar_desktop')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-98 transition-all"
              >
                <span>{t.nav.validateRole}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Mobile Actions: Language Switcher & Hamburger Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#030712] border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-fade-in-up">
          <div className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
            <a
              href="#product-transformation"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
            >
              {t.nav.product}
            </a>
            <Link
              href="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
            >
              {t.nav.forCompanies}
            </Link>
            <Link
              href="/talents"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
            >
              {t.nav.forTalent}
            </Link>
            <Link
              href="/contact?intent=partner-delivery"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
            >
              {t.nav.partners}
            </Link>
            <Link
              href="/methodology"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
            >
              {t.nav.methodology}
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <Link
              href="/contact?intent=validate-role"
              onClick={() => handleValidateRoleClick('navbar_mobile')}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
            >
              <span>{t.nav.validateRole}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
