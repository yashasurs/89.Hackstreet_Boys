'use client'

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProfileAvatar from './profile/ProfileAvatar';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <nav className="bg-[#202225] shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#8e6bff]">BrightMind</span>
          </Link>
          
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <span className="text-[#dcddde] text-sm hidden sm:inline">{user.username}</span>
              <ProfileAvatar size="sm" />
              <button 
                onClick={logout}
                className="text-sm text-[#b9bbbe] hover:text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm text-[#b9bbbe] hover:text-white">
                Login
              </Link>
              <Link 
                href="/register" 
                className="text-sm bg-[#8e6bff] hover:bg-[#7b5cff] px-4 py-2 rounded-md text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}