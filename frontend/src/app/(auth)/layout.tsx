import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#36393f]">
      {/* Background design element */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#8e6bff]/10 blur-3xl"></div>
        <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-[#8e6bff]/5 blur-3xl"></div>
      </div>
      
      {/* We'll render the children (login/register pages) here */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}