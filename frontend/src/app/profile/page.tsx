'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { User } from '@/types/users';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { translate } = useLanguage();
  const { user, isAuthenticated, isLoading, logout, getToken } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#36393f] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8e6bff]"></div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#36393f] text-white">
        <Navbar />
        <div className="max-w-md mx-auto mt-20 p-6 bg-[#2f3136] rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-center mb-4">{translate('loginRequired', 'profile')}</h2>
          <p className="text-center text-[#b9bbbe] mb-6">{translate('loginToViewProfile', 'profile')}</p>
          <div className="flex justify-center">
            <a href="/login" className="bg-[#8e6bff] hover:bg-[#7b5ce5] text-white px-6 py-2 rounded-md transition-colors">
              {translate('login', 'navbar')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setDeleteError('');
      
      const token = await getToken();
      
      const response = await fetch('http://localhost:8000/api/profile/delete/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete account: ${response.statusText}`);
      }
      
      // Account deleted successfully, log the user out
      await logout();
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete account');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Add this function to handle password change:
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(translate('allFieldsRequired', 'profile'));
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError(translate('passwordsDoNotMatch', 'profile'));
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError(translate('passwordTooShort', 'profile'));
      return;
    }
    
    try {
      setIsChangingPassword(true);
      
      const token = await getToken();
      
      const response = await fetch('http://localhost:8000/api/profile/change-password/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error: ${response.status}`);
      }
      
      // Clear form fields on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess(translate('passwordUpdated', 'profile'));
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setPasswordSuccess('');
      }, 5000);
      
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Using only standard User properties
  const displayName = user.username || 'User';
  const userEmail = user.email || 'No email provided';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#36393f] text-white">
      <Navbar />
      
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#8e6bff]">
          {translate('title', 'profile')}
        </h1>
        
        {/* Personal Information Section */}
        <div className="bg-[#2f3136] rounded-xl shadow-lg p-6 mb-6 border border-[#202225]">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-[#40444b]">
            {translate('personalInfo', 'profile')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User information fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-[#b9bbbe] text-sm font-bold mb-2">
                  {translate('name', 'profile')}
                </label>
                <div className="text-white">{displayName}</div>
              </div>
              
              <div>
                <label className="block text-[#b9bbbe] text-sm font-bold mb-2">
                  {translate('email', 'profile')}
                </label>
                <div className="text-white">{userEmail}</div>
              </div>
              
              <div>
                <label className="block text-[#b9bbbe] text-sm font-bold mb-2">
                  {translate('role', 'profile')}
                </label>
                <div className="text-white">User</div>
              </div>
            </div>
            
          </div>
          
          <div className="mt-6">
            <label className="block text-[#b9bbbe] text-sm font-bold mb-2">
              {translate('bio', 'profile')}
            </label>
            <div className="text-white bg-[#202225] p-4 rounded-md min-h-[100px]">
              No bio provided yet.
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="bg-[#8e6bff] hover:bg-[#7b5ce5] text-white px-6 py-2 rounded-md transition-colors">
              {translate('editProfile', 'profile')}
            </button>
          </div>
        </div>
        
        
        
        {/* Password Change Section */}
        <div className="bg-[#2f3136] rounded-xl shadow-lg p-6 mb-6 border border-[#202225]">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-[#40444b]">
            {translate('changePassword', 'profile')}
          </h2>
          
          {passwordError && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-20 text-red-300 rounded-md border border-red-800">
              {passwordError}
            </div>
          )}
          
          {passwordSuccess && (
            <div className="mb-4 p-3 bg-green-900 bg-opacity-20 text-green-300 rounded-md border border-green-800">
              {passwordSuccess}
            </div>
          )}
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-[#b9bbbe] text-sm font-bold mb-2">
                {translate('currentPassword', 'profile')}
              </label>
              <input 
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full py-2 px-3 bg-[#202225] text-white rounded-md border border-[#40444b] focus:border-[#8e6bff] focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-[#b9bbbe] text-sm font-bold mb-2">
                {translate('newPassword', 'profile')}
              </label>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full py-2 px-3 bg-[#202225] text-white rounded-md border border-[#40444b] focus:border-[#8e6bff] focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-[#b9bbbe] text-sm font-bold mb-2">
                {translate('confirmPassword', 'profile')}
              </label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-2 px-3 bg-[#202225] text-white rounded-md border border-[#40444b] focus:border-[#8e6bff] focus:outline-none"
              />
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                type="submit"
                disabled={isChangingPassword}
                className="bg-[#8e6bff] hover:bg-[#7b5ce5] text-white px-6 py-2 rounded-md transition-colors flex items-center"
              >
                {isChangingPassword && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                )}
                {translate('updatePassword', 'profile')}
              </button>
            </div>
          </form>
        </div>
        
        {/* Delete Account Section */}
        <div className="bg-[#2f3136] rounded-xl shadow-lg p-6 border border-[#202225]">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-[#40444b] text-red-400">
            {translate('deleteAccount', 'profile')}
          </h2>
          
          <p className="text-[#b9bbbe] mb-4">
            {translate('deleteAccountWarning', 'profile')}
          </p>
          
          {deleteError && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-20 text-red-300 rounded-md border border-red-800">
              {deleteError}
            </div>
          )}
          
          <div className="flex justify-end">
            {showDeleteConfirm ? (
              <div className="flex items-center gap-3">
                <span className="text-red-300">Are you sure?</span>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors flex items-center"
                >
                  {isDeleting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  )}
                  {translate('confirmDelete', 'profile')}
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-[#4f545c] hover:bg-[#5d6269] text-white px-4 py-2 rounded-md transition-colors"
                >
                  {translate('cancel', 'profile')}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                {translate('deleteAccount', 'profile')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;