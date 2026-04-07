'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-slate-950 border-t border-white/5 pt-32 pb-16 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
            </div>
            
            <div className="max-w-base mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-32">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="group inline-flex items-center gap-3 mb-8">
                            <img src="/logo_oficial.png" alt="TalentSync360" className="h-6 w-auto opacity-50 group-hover:opacity-100 transition-opacity grayscale brightness-200" />
                            <span className="text-base tracking-[0.15em] text-slate-100 font-bold uppercase">TalentSync<span className="font-light text-slate-500">360</span></span>
                        </Link>
                        <p className="text-slate-500 font-light text-sm leading-relaxed max-w-xs">
                          {t.footer.tagline}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-blue-500 font-bold text-[10px] tracking-[0.3em] uppercase mb-10">{t.footer.companiesTitle}</h3>
                        <ul className="space-y-4">
                            <li><Link href="/companies" className="text-slate-500 font-light hover:text-slate-200 transition-colors text-sm">{t.footer.companiesLink1}</Link></li>
                            <li><Link href="/methodology" className="text-slate-500 font-light hover:text-slate-200 transition-colors text-sm">{t.footer.companiesLink2}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-blue-500 font-bold text-[10px] tracking-[0.3em] uppercase mb-10">{t.footer.talentsTitle}</h3>
                        <ul className="space-y-4">
                            <li><Link href="/talents" className="text-slate-500 font-light hover:text-slate-200 transition-colors text-sm">{t.footer.talentsLink1}</Link></li>
                            <li><Link href="/contact" className="text-slate-500 font-light hover:text-slate-200 transition-colors text-sm">{t.footer.talentsLink2}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-blue-500 font-bold text-[10px] tracking-[0.3em] uppercase mb-10">{t.footer.resourcesTitle}</h3>
                        <ul className="space-y-4">
                            <li><Link href="/contact" className="text-slate-500 font-light hover:text-slate-200 transition-colors text-sm">{t.footer.resourcesLink1}</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-slate-600">
                    <div className="text-[10px] tracking-[0.1em] uppercase font-bold mb-6 md:mb-0">
                        © {new Date().getFullYear()} TalentSync360. <span className="font-light">{t.footer.copyright}</span>
                    </div>
                    <div className="flex space-x-10 text-[10px] tracking-[0.1em] uppercase font-bold">
                        <Link href="/terms" className="hover:text-blue-500 transition-colors duration-300">{t.footer.terms}</Link>
                        <Link href="/privacy" className="hover:text-blue-500 transition-colors duration-300">{t.footer.privacy}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
