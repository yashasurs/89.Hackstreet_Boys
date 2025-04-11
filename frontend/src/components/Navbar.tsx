'use client'

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Check if a link is active
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <nav className="bg-gradient-to-r from-[#202225] to-[#2b2d31] shadow-lg sticky top-0 z-50 border-b border-[#40444b]">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="bg-gradient-to-br from-[#8e6bff] to-[#6045cc] p-2.5 rounded-xl shadow-md group-hover:shadow-[#8e6bff]/30 transition-all duration-300 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight group-hover:text-[#8e6bff] transition-colors duration-300">
              BrightMind
            </span>
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/" isActive={isActive('/')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </NavLink>
            
            <NavLink href="/content" isActive={isActive('/content')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Content
            </NavLink>
            
            {isAuthenticated && (
              <NavLink href="/profile" isActive={isActive('/profile')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </NavLink>
            )}
          </div>
          
          {/* User Profile/Auth Section */}
          <div className="flex items-center">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center bg-[#36393f] px-4 py-2 rounded-lg border border-[#40444b]">
                  <div className="w-8 h-8 rounded-full bg-[#8e6bff] text-white flex items-center justify-center font-bold text-sm mr-3">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{user.username}</span>
                </div>
                <button 
                  onClick={logout}
                  className="text-white bg-[#8e6bff] hover:bg-[#7b5ce5] px-5 py-2.5 rounded-lg text-base font-medium transition-all duration-300 shadow-md hover:shadow-[#8e6bff]/30 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className="text-[#dcddde] hover:text-white px-4 py-2.5 rounded-lg hover:bg-[#36393f] transition-all duration-300 text-base font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="text-white bg-[#8e6bff] hover:bg-[#7b5ce5] px-5 py-2.5 rounded-lg text-base font-medium transition-all duration-300 shadow-md hover:shadow-[#8e6bff]/30 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden ml-4 text-white p-2 bg-[#36393f] rounded-lg hover:bg-[#4e5058] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-[#2f3136] rounded-lg p-4 border border-[#40444b] shadow-lg animate-fadeDown">
            <div className="flex flex-col space-y-3">
              <MobileNavLink href="/" isActive={isActive('/')} setIsMenuOpen={setIsMenuOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </MobileNavLink>
              
              <MobileNavLink href="/content" isActive={isActive('/content')} setIsMenuOpen={setIsMenuOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Content
              </MobileNavLink>
              
              {isAuthenticated && (
                <MobileNavLink href="/profile" isActive={isActive('/profile')} setIsMenuOpen={setIsMenuOpen}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </MobileNavLink>
              )}
              
              {isAuthenticated && user && (
                <div className="flex items-center p-3 bg-[#36393f] rounded-lg mt-2">
                  <div className="w-8 h-8 rounded-full bg-[#8e6bff] text-white flex items-center justify-center font-bold text-sm mr-3">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{user.username}</span>
                </div>
              )}
              
              <div className="pt-2 mt-2 border-t border-[#40444b]">
                {isAuthenticated ? (
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center bg-[#8e6bff] hover:bg-[#7b5ce5] text-white py-3 px-4 rounded-lg font-medium transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/login"
                      className="flex items-center justify-center bg-[#36393f] hover:bg-[#4e5058] text-white py-3 px-4 rounded-lg font-medium transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center bg-[#8e6bff] hover:bg-[#7b5ce5] text-white py-3 px-4 rounded-lg font-medium transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// NavLink component for desktop navigation
function NavLink({ href, isActive, children }: { href: string, isActive: boolean, children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className={`px-4 py-3 rounded-lg text-base font-medium flex items-center transition-all duration-300 ${
        isActive 
          ? 'bg-[#36393f] text-white border-l-4 border-[#8e6bff] pl-3' 
          : 'text-[#b9bbbe] hover:bg-[#36393f] hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

// Mobile nav link component
function MobileNavLink({ 
  href, 
  isActive, 
  children, 
  setIsMenuOpen 
}: { 
  href: string, 
  isActive: boolean, 
  children: React.ReactNode,
  setIsMenuOpen: (value: boolean) => void 
}) {
  return (
    <Link 
      href={href} 
      className={`px-4 py-3 rounded-lg text-base font-medium flex items-center ${
        isActive 
          ? 'bg-[#36393f] text-white border-l-4 border-[#8e6bff] pl-3' 
          : 'text-[#b9bbbe] hover:bg-[#36393f] hover:text-white'
      }`}
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );
}