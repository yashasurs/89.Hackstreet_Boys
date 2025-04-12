'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher'; // Import the LanguageSwitcher
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguage();

  useEffect(() => {
    // Add click event listener to close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setIsDropdownOpen(false);
    router.push('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-[#202225] shadow-md border-b border-[#40444b]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-[#8e6bff] font-bold text-xl">
              {translate('appName', 'navbar')}
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-[#dcddde] hover:text-white px-3 py-2">
              {translate('home', 'navbar')}
            </Link>
            <Link href="/content" className="text-[#dcddde] hover:text-white px-3 py-2">
              {translate('content', 'navbar')}
            </Link>
            <Link href="/profile" className="text-[#dcddde] hover:text-white px-3 py-2">
              {translate('profile', 'navbar')}
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Add the LanguageSwitcher here */}
            <LanguageSwitcher />
            
            {/* Existing authentication buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <Button 
                  onClick={toggleDropdown}
                  variant="ghost" 
                  className="text-white hover:bg-[#36393f]"
                >
                  {user?.username || user?.email  || 'Account'}
                </Button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#2f3136] rounded-md shadow-lg py-1 z-50 border border-[#40444b]">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-[#dcddde] hover:bg-[#36393f]"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {translate('profile', 'navbar')}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-[#dcddde] hover:bg-[#36393f]"
                    >
                      {translate('Logout', 'navbar')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  className="text-[#dcddde] hover:text-white"
                  onClick={() => router.push('/login')}
                >
                  {translate('login', 'navbar')}
                </Button>
                <Button 
                  className="bg-[#8e6bff] hover:bg-[#7b5ce5] text-white"
                  onClick={() => router.push('/register')}
                >
                  {translate('getStarted', 'navbar')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}