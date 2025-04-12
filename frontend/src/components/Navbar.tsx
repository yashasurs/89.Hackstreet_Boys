'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Menu, X, User, LogOut, Home, FileText, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguage();

  useEffect(() => {
    // Add click event listener to close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-[#202225] shadow-md border-b border-[#40444b] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="w-8 h-8 bg-[#8e6bff] rounded-md flex items-center justify-center text-white font-bold"
              >
                <Lightbulb />
              </motion.div>
              <span className="text-[#8e6bff] font-bold text-xl group-hover:text-white transition-colors duration-200">
                {translate('appName', 'navbar')}
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center space-x-2 ${
                isActive('/') 
                  ? 'text-white bg-[#36393f]' 
                  : 'text-[#dcddde] hover:text-white hover:bg-[#36393f]'
              }`}
            >
              <Home size={18} />
              <span>{translate('home', 'navbar')}</span>
            </Link>
            <Link 
              href="/content" 
              className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center space-x-2 ${
                isActive('/content') 
                  ? 'text-white bg-[#36393f]' 
                  : 'text-[#dcddde] hover:text-white hover:bg-[#36393f]'
              }`}
            >
              <FileText size={18} />
              <span>{translate('content', 'navbar')}</span>
            </Link>
            <Link 
              href="/profile" 
              className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center space-x-2 ${
                isActive('/profile') 
                  ? 'text-white bg-[#36393f]' 
                  : 'text-[#dcddde] hover:text-white hover:bg-[#36393f]'
              }`}
            >
              <FileText size={18} />
              <span>{translate('profile', 'navbar')}</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Authentication */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <Button 
                  onClick={toggleDropdown}
                  variant="ghost" 
                  className="text-white hover:bg-[#36393f] rounded-full flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-[#8e6bff] rounded-full flex items-center justify-center text-white font-bold">
                    {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <span className="hidden sm:inline">{user?.username || user?.email || 'Account'}</span>
                </Button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-[#2f3136] rounded-md shadow-lg py-1 z-50 border border-[#40444b]"
                    >
                      <Link 
                        href="/profile" 
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-[#dcddde] hover:bg-[#36393f]"
                      >
                        <User size={16} className="mr-2" />
                        {translate('Profile', 'navbar')}
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-[#dcddde] hover:bg-[#36393f]"
                      >
                        <LogOut size={16} className="mr-2" />
                        {translate('Logout', 'navbar')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  className="text-[#dcddde] hover:text-white hover:bg-[#36393f]"
                  onClick={() => router.push('/login')}
                >
                  {translate('login', 'navbar')}
                </Button>
                <Button 
                  className="bg-[#8e6bff] hover:bg-[#7b5ce5] text-white transition-all duration-300 hover:scale-105"
                  onClick={() => router.push('/register')}
                >
                  {translate('getStarted', 'navbar')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden text-[#dcddde] hover:text-white"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#2f3136] border-t border-[#40444b] overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              <Link 
                href="/" 
                className={`block px-3 py-2 rounded-md ${
                  isActive('/') 
                    ? 'bg-[#36393f] text-white' 
                    : 'text-[#dcddde] hover:bg-[#36393f] hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Home size={18} />
                  <span>{translate('home', 'navbar')}</span>
                </div>
              </Link>
              <Link 
                href="/content" 
                className={`block px-3 py-2 rounded-md ${
                  isActive('/content') 
                    ? 'bg-[#36393f] text-white' 
                    : 'text-[#dcddde] hover:bg-[#36393f] hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <FileText size={18} />
                  <span>{translate('content', 'navbar')}</span>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}