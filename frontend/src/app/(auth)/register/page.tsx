'use client'

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !firstName || !lastName || !username) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes only
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-[#36393f] flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-[#202225] shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#8e6bff]">BrightMind</span>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Register Container */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-[#2f3136] rounded-lg shadow-xl w-full max-w-md p-8 border border-[#202225]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Create an Account</h1>
            <p className="text-[#b9bbbe]">Join our community and start learning!</p>
          </div>
          
          {error && (
            <div className="bg-[#f04747]/10 border border-[#f04747] text-[#f04747] px-4 py-3 rounded-md mb-6">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
          <div className="mb-6">
              <label htmlFor="firstName" className="block text-[#dcddde] text-sm font-medium mb-2">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#202225] border border-[#40444b] text-white focus:outline-none focus:ring-2 focus:ring-[#8e6bff] focus:border-transparent transition-all"
                placeholder="Enter your first name"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="lastName" className="block text-[#dcddde] text-sm font-medium mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#202225] border border-[#40444b] text-white focus:outline-none focus:ring-2 focus:ring-[#8e6bff] focus:border-transparent transition-all"
                placeholder="Enter your last name"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="username" className="block text-[#dcddde] text-sm font-medium mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#202225] border border-[#40444b] text-white focus:outline-none focus:ring-2 focus:ring-[#8e6bff] focus:border-transparent transition-all"
                placeholder="Enter your username"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-[#dcddde] text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#202225] border border-[#40444b] text-white focus:outline-none focus:ring-2 focus:ring-[#8e6bff] focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-[#dcddde] text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#202225] border border-[#40444b] text-white focus:outline-none focus:ring-2 focus:ring-[#8e6bff] focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>
               
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-[#8e6bff] hover:bg-[#7b5cff] text-white font-medium rounded-md transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </button>
            
            <div className="mt-6 text-center text-sm text-[#b9bbbe]">
              <p>
                Already have an account?{" "}
                <Link href="/login" className="text-[#8e6bff] hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#202225] py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-[#72767d]">
            <div className="mb-2 sm:mb-0">
              <p>© 2025 BrightMind. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/privacy" className="hover:text-[#8e6bff] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#8e6bff] transition-colors">Terms of Service</Link>
              <Link href="/help" className="hover:text-[#8e6bff] transition-colors">Help Center</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}