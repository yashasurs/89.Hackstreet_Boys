'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

export type User = {
  username: string;
  // Add other user fields as needed
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, refreshToken: string | null, userData: User) => void;
  logout: () => void;
  getToken: () => Promise<string | null>; // Added getToken method
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Improved getToken method
  const getToken = async (): Promise<string | null> => {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        console.warn('No token found in localStorage');
        return null;
      }
      return storedToken;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  useEffect(() => {
    // Load user data from localStorage on mount
    const storedToken = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (storedToken && userData) {
      setToken(storedToken);
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, refreshToken: string | null, userData: User) => {
    // Validate token before storing
    if (!newToken) {
      console.error('Login failed: Token is undefined or empty');
      return;
    }
    
    localStorage.setItem('token', newToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    localStorage.setItem('userData', JSON.stringify(userData));
    
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberUser');
    
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        token,
        login,
        logout,
        getToken // Added to the context value
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}