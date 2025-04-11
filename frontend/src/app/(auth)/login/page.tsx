'use client'

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
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
      
      {/* Login Container */}
      <div className="flex-grow flex items-center justify-center p-4 py-12">
        <div className="bg-[#2f3136] rounded-lg shadow-xl w-full max-w-2xl p-8 border border-[#202225]">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Left side with form */}
            <div className="md:col-span-3">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-[#b9bbbe]">We're so excited to see you again!</p>
              </div>
              
              {error && (
                <div className="bg-[#f04747]/10 border border-[#f04747] text-[#f04747] px-4 py-3 rounded-md mb-6">
                  <p>{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-[#dcddde] text-sm font-medium mb-2">
                    EMAIL
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
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="text-[#dcddde] text-sm font-medium">
                      PASSWORD
                    </label>
                    <Link href="/forgot-password" className="text-xs text-[#8e6bff] hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-[#202225] border border-[#40444b] text-white focus:outline-none focus:ring-2 focus:ring-[#8e6bff] focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="sr-only peer"
                    />
                    <span className="w-4 h-4 border border-[#72767d] rounded flex items-center justify-center mr-2 peer-checked:bg-[#8e6bff] peer-checked:border-[#8e6bff] transition-all">
                      {rememberMe && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm text-[#dcddde]">Stay signed in</span>
                  </label>
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
                      Logging in...
                    </span>
                  ) : (
                    "Log In"
                  )}
                </button>
                
                <div className="mt-6 text-center text-sm text-[#b9bbbe]">
                  <p>
                    Need an account?{" "}
                    <Link href="/register" className="text-[#8e6bff] hover:underline">
                      Register
                    </Link>
                  </p>
                </div>
              </form>
            </div>
            
            {/* Right side with illustration/info */}
            <div className="hidden md:flex md:col-span-2 bg-[#202225] rounded-lg p-6 flex-col items-center justify-center">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-white mb-2">Enhanced Learning</h3>
              <p className="text-center text-[#b9bbbe] text-sm">
                Log in to access your personalized learning journey and track your progress.
              </p>
            </div>
          </div>
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