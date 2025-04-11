'use client'

import { useState } from 'react'

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

type ProfileFormProps = {
  profile: Profile;
  onSave: (profileData: Profile) => Promise<void>;
}

export default function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState<Profile>({
    ...profile,
    user: { ...profile.user }
  })
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name === 'email' || name === 'first_name' || name === 'last_name') {
      setFormData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMessage(null)
    
    try {
      await onSave(formData)
      setIsSaving(false)
    } catch (error) {
      setErrorMessage('Failed to save profile changes')
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-300">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.user.first_name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-[#202225] border border-[#40444b] text-white focus:outline-none focus:ring-2 focus:ring-[#8e6bff] focus:border-transparent transition-all"
              placeholder="Your first name"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.user.last_name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-[#202225] border border-[#40444b] text-white focus:outline-none focus:ring-2 focus:ring-[#8e6bff] focus:border-transparent transition-all"
              placeholder="Your last name"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.user.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-[#202225] border border-[#40444b] text-white focus:outline-none focus:ring-2 focus:ring-[#8e6bff] focus:border-transparent transition-all"
            placeholder="Your email"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-300">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.user.username}
            disabled
            className="w-full px-4 py-2 rounded-md bg-[#202225] border border-[#40444b] text-gray-400 cursor-not-allowed"
            placeholder="Your username"
          />
          <p className="text-xs text-gray-400">Username cannot be changed</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Profile Details</h2>
        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded-md bg-[#202225] border border-[#40444b] text-white focus:outline-none focus:ring-2 focus:ring-[#8e6bff] focus:border-transparent transition-all"
            placeholder="Tell us about yourself"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-gray-300">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-[#202225] border border-[#40444b] text-white focus:outline-none focus:ring-2 focus:ring-[#8e6bff] focus:border-transparent transition-all"
            placeholder="Your location"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-[#8e6bff] hover:bg-[#7b5fe1] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#8e6bff] focus:ring-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaving}
        >
          {isSaving ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </div>
          ) : "Save Changes"}
        </button>
      </div>
    </form>
  )
}