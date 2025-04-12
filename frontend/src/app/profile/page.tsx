'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Edit, Save, X, FileText, LogOut } from 'lucide-react';

// Define types for our data
interface Profile {
  bio: string;
  location: string;
  website: string;
  [key: string]: any;
}

// Combine both ContentItem interfaces into one with all properties


interface ProfileFormData {
  bio: string;
  location: string;
  website: string;
  [key: string]: string;
}

// Updated ContentItem interface to match the actual API response structure
interface ContentItem {
  id: number;
  topic: string;
  content: {
    topic: string;
    summary: string;
    sections: {
      title: string;
      content: string;
      key_points: string[];
    }[];
    references: string[];
    difficulty_level: string;
  };
  difficulty_level: string;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, token, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userContents, setUserContents] = useState<ContentItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState<ProfileFormData>({
    bio: '',
    location: '',
    website: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Use token from AuthContext instead of localStorage
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }
        
        const response = await axios.get('http://localhost:8000/api/profile/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        
        setProfile(response.data);
        setFormData({
          bio: response.data.bio || '',
          location: response.data.location || '',
          website: response.data.website || '',
        });
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        // Check for 401 Unauthorized to handle expired tokens
        if (err.response && err.response.status === 401) {
          // If using refresh tokens, could trigger a token refresh here
          setError('Session expired. Please login again.');
          if (logout) logout();
          router.push('/login');
        } else {
          setError('Failed to load profile information');
        }
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchProfile();
    } else if (!isAuthenticated) {
      setLoading(false);
      setError('Please login to view your profile');
    }
  }, [isAuthenticated, user, token, logout, router]);

  // Fetch user content
  useEffect(() => {
    const fetchUserContent = async () => {
      try {
        if (!token) return;
        
        const response = await axios.get('http://localhost:8000/api/user-contents/', {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          }
        });
        
        // Log the response to see the actual structure
        console.log('User content response:', response.data);
        
        setUserContents(response.data);
      } catch (err: any) {
        console.error('Error fetching user content:', err);
        // Handle unauthorized errors
        if (err.response && err.response.status === 401) {
          // Handle unauthorized
        }
      }
    };

    if (isAuthenticated && user) {
      fetchUserContent();
    }
  }, [isAuthenticated, user, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!token) {
        setError('Authentication required');
        return;
      }
      
      // Log what we're sending to better debug
      console.log('Sending profile data:', formData);
      
      // Replace the axios.put call with axios.patch
      await axios.patch('http://localhost:8000/api/profile/update/', formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        }
      });
      
      // Update the profile state with new data
      setProfile(prev => {
        if (prev) {
          return { ...prev, ...formData };
        }
        return formData as Profile;
      });
      
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      // Log the actual error response to see what's wrong
      if (err.response) {
        console.error('Server error response:', err.response.data);
        setError(`Failed to update profile: ${JSON.stringify(err.response.data)}`);
      } else {
        setError('Failed to update profile');
      }
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (logout) {
      logout();
      router.push('/login');
    }
  };

  if (!isAuthenticated && !loading) {
    return null; // Will redirect due to the useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#36393f] text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#8e6bff]">My Profile</h1>
          <Button 
            variant="ghost" 
            className="text-[#dcddde] hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
        
        {/* Tabs remain the same */}
        <div className="mb-6">
          <div className="flex border-b border-[#40444b]">
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`px-4 py-2 font-medium ${activeTab === 'profile' 
                ? 'text-[#8e6bff] border-b-2 border-[#8e6bff]' 
                : 'text-[#dcddde]'}`}
            >
              Profile Information
            </button>
            <button 
              onClick={() => setActiveTab('content')} 
              className={`px-4 py-2 font-medium ${activeTab === 'content' 
                ? 'text-[#8e6bff] border-b-2 border-[#8e6bff]' 
                : 'text-[#dcddde]'}`}
            >
              My Content
            </button>
          </div>
        </div>
        
        {/* Profile Tab Content - No changes needed */}
        {activeTab === 'profile' && (
          <div className="bg-[#2f3136] rounded-lg shadow-md border border-[#40444b]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#8e6bff]">Profile Details</h2>
                {!isEditing && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    className="text-[#dcddde] hover:text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                )}
              </div>
              <p className="text-[#b9bbbe] mb-4">Manage your personal information</p>
              
              {/* Rest of the profile section remains the same */}
              {loading ? (
                <p className="text-[#dcddde]">Loading profile information...</p>
              ) : error ? (
                <p className="text-red-400">{error}</p>
              ) : isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[#dcddde] text-sm mb-1 block">Username</label>
                      <input 
                        value={user?.username || user?.email || ''}
                        disabled
                        className="w-full px-3 py-2 bg-[#40444b] border border-[#40444b] rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[#dcddde] text-sm mb-1 block">Bio</label>
                      <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#40444b] border border-[#40444b] rounded-md text-white"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-[#dcddde] text-sm mb-1 block">Location</label>
                      <input 
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#40444b] border border-[#40444b] rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[#dcddde] text-sm mb-1 block">Website</label>
                      <input 
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#40444b] border border-[#40444b] rounded-md text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCancel}
                      className="text-[#dcddde] hover:text-white"
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="default" 
                      size="sm"
                      className="bg-[#8e6bff] hover:bg-[#7b5ce5] text-white"
                    >
                      <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                  </div>
                </form>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-white">
                    {user?.username || user?.email || 'User'}
                  </h2>
                  <p className="text-[#dcddde] mb-2">Email: {user?.email}</p>
                  <p className="text-[#dcddde] mb-2">Bio: {profile?.bio || 'No bio provided'}</p>
                  <p className="text-[#dcddde] mb-2">Location: {profile?.location || 'Not specified'}</p>
                  <p className="text-[#dcddde] mb-2">Website: {profile?.website || 'Not specified'}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Content Tab - Updated to match actual data structure */}
        {activeTab === 'content' && (
          <div className="bg-[#2f3136] rounded-lg shadow-md border border-[#40444b]">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-[#8e6bff]">My Content</h2>
              <p className="text-[#b9bbbe] mb-4">Manage your educational content</p>
              
              {userContents.length > 0 ? (
                <ul className="space-y-4">
                  {userContents.map((content) => (
                    <li key={content.id} className="p-4 bg-[#36393f] rounded-md border border-[#40444b]">
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-[#8e6bff] mr-3 mt-1 flex-shrink-0" />
                        <div className="flex-1 overflow-hidden">
                          {/* Topic as title */}
                          <h3 className="text-white font-medium mb-1">
                            {content.topic || "Untitled Content"}
                          </h3>
                          
                          {/* Created date */}
                          <div className="flex items-center mb-2">
                            <p className="text-xs text-[#b9bbbe]">
                              Created: {content.created_at 
                                ? new Date(content.created_at).toLocaleDateString() 
                                : 'Date not available'}
                            </p>
                          </div>
                          
                          {/* Display summary */}
                          {content.content?.summary && (
                            <p className="text-sm text-[#dcddde] mb-2 line-clamp-2">
                              {content.content.summary}
                            </p>
                          )}
                          
                          {/* Display section count */}
                          {content.content?.sections && (
                            <p className="text-xs text-[#b9bbbe] mb-2">
                              {content.content.sections.length} section{content.content.sections.length !== 1 ? 's' : ''}
                            </p>
                          )}
                          
                          {/* Display difficulty level and other metadata */}
                          <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-[#b9bbbe]">
                            {content.difficulty_level && (
                              <span className="bg-[#2f3136] px-2 py-1 rounded">
                                Difficulty: {content.difficulty_level}
                              </span>
                            )}
                            {content.content?.references && content.content.references.length > 0 && (
                              <span className="bg-[#2f3136] px-2 py-1 rounded">
                                {content.content.references.length} reference{content.content.references.length !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#dcddde]">You haven't created any content yet</p>
                  <Button 
                    variant="default"
                    className="mt-4 bg-[#8e6bff] hover:bg-[#7b5ce5] text-white"
                    onClick={() => router.push('/content')}
                  >
                    Create Content
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}