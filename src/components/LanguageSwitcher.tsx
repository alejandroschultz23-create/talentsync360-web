'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-1 text-xs font-medium rounded transition-all ${
          lang === 'en'
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('es')}
        className={`px-2 py-1 text-xs font-medium rounded transition-all ${
          lang === 'es'
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        ES
      </button>
    </div>
  );
}
