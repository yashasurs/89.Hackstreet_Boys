import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'english', name: 'English' },
    { code: 'kannada', name: 'ಕನ್ನಡ' },
    { code: 'hindi', name: 'हिंदी' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (langCode: string) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  // Get current language display name
  const currentLang = languages.find(l => l.code === language)?.name || 'English';

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center gap-1 text-white hover:text-[#8e6bff] transition-colors p-2 rounded-md hover:bg-[#40444b]/50"
        aria-label="Change language"
      >
        <Globe className="h-5 w-5" />
        <span className="text-sm hidden sm:inline font-medium">{currentLang}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-[#2f3136] border border-[#40444b] z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`block px-4 py-2 text-sm text-left w-full ${
                  language === lang.code 
                    ? 'bg-[#8e6bff] bg-opacity-20 text-white' 
                    : 'text-[#dcddde] hover:bg-[#40444b]'
                }`}
                onClick={() => changeLanguage(lang.code)}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;