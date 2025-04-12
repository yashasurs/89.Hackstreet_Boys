'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProfileForm from '@/components/profile/ProfileForm'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

type Profile = {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  bio: string;
  location: string;
}

export default function ProfilePage() {
  const { isAuthenticated, user, token } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !token) {
        setIsLoading(false)
        return
      }

      try {
        // API call to fetch profile
        const response = await fetch('http://localhost:8000/api/profile/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }

        const userData = await response.json()
        
        // Create profile data structure
        const profileData = {
          user: userData,
          bio: userData.bio || '',
          location: userData.location || ''
        }
        setProfile(profileData)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError('Failed to fetch profile data')
        
        // If API fails, use data from auth context as fallback
        if (user) {
          setProfile({
            user: {
              ...user,
              id: 0,
              email: '',
              first_name: '',
              last_name: ''
            },
            bio: '',
            location: ''
          })
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProfile()
  }, [isAuthenticated, token, user])

  const handleSaveProfile = async (profileData: Profile) => {
    if (!token) return
    
    try {
      // Extract user data for API
      const { first_name, last_name, email } = profileData.user || {}
      const { bio, location } = profileData
      
      // API call to update profile
      const response = await fetch('http://localhost:8000/api/profile/update/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          bio,
          location
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update profile')
      }
      
      
      const updatedData = await response.json()
      
      // Update local state with server response
      setProfile(prev => {
        if (!prev) return null
        return {
          ...prev,
          user: {
            ...prev.user,
            first_name: updatedData.first_name,
            last_name: updatedData.last_name,
            email: updatedData.email
          },
          bio: updatedData.bio || prev.bio,
          location: updatedData.location || prev.location
        }
      })
      
      return Promise.resolve()
    } catch (err) {
      console.error('Error saving profile:', err)
      return Promise.reject(err)
    }
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#36393f] flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-[#2f3136] rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Your Profile</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8e6bff]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white px-4 py-3 rounded">
              {error}
            </div>
          ) : profile ? (
            <ProfileForm profile={profile} onSave={handleSaveProfile} />
          ) : null}
        </div>
      </main>
    </div>
    </>
  )
}