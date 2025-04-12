'use client'

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => setLanguage('english')}
        className={`px-2 py-1 rounded ${language === 'english' ? 'bg-[#8e6bff] text-white' : 'bg-[#36393f] text-[#b9bbbe]'}`}
      >
        English
      </button>
      <button 
        onClick={() => setLanguage('hindi')}
        className={`px-2 py-1 rounded ${language === 'hindi' ? 'bg-[#8e6bff] text-white' : 'bg-[#36393f] text-[#b9bbbe]'}`}
      >
        हिन्दी
      </button>
    </div>
  );
}