'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

type ProfileAvatarProps = {
  size?: 'sm' | 'md' | 'lg';
  showDropdown?: boolean;
}

export default function ProfileAvatar({ size = 'md', showDropdown = false }: ProfileAvatarProps) {
  const { user } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Determine avatar size based on prop
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 }
  }

  const { width, height } = dimensions[size]

  // Get initials from user's name or username
  const getInitials = () => {
    if (!user) return '?'
    
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }
    
    return user.username.substring(0, 2).toUpperCase()
  }

  const toggleDropdown = () => {
    if (showDropdown) {
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  return (
    <div className="relative">
      <div 
        className={`
          rounded-full bg-[#8e6bff] flex items-center justify-center text-white font-medium cursor-pointer
          ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}
        `}
        style={{ width, height }}
        onClick={toggleDropdown}
      >
        {getInitials()}
      </div>
      
      {showDropdown && isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#2f3136] ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <Link 
              href="/profile" 
              className="block px-4 py-2 text-sm text-[#dcddde] hover:bg-[#36393f]"
              onClick={() => setIsDropdownOpen(false)}
            >
              Your Profile
            </Link>
            <Link 
              href="/settings" 
              className="block px-4 py-2 text-sm text-[#dcddde] hover:bg-[#36393f]"
              onClick={() => setIsDropdownOpen(false)}
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}