'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Book, Brain, Users, CheckCircle, Download, FileDown } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlighted?: boolean;
}

function FeatureCard({ icon, title, description, highlighted = false }: FeatureCardProps) {
  return (
    <div className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
      highlighted ? 'bg-[#2c2e33] border border-[#8e6bff] border-opacity-30' : 'bg-[#2f3136]'
    }`}>
      <div className={`mb-4 ${highlighted ? 'text-[#8e6bff]' : 'text-white'}`}>{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-[#dcddde]">{description}</p>
      {highlighted && (
        <div className="mt-4 pt-4 border-t border-[#40444b]">
          <span className="text-sm font-medium text-[#8e6bff] flex items-center">
            <FileDown className="w-4 h-4 mr-1" /> Featured Functionality
          </span>
        </div>
      )}
    </div>
  );
}


interface StepProps {
  number: string;
  title: string;
  description: string;
}

function Step({ number, title, description }: StepProps) {
  return (
    <div className="flex items-start mb-8">
      <div className="bg-[#8e6bff] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mr-4">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-[#dcddde]">{description}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguage();

  useEffect(() => {
    // Add click event listener to close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // Use your auth context's logout method instead if available
    // For now, just update the dropdown state
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#36393f] text-white">
      {/* Add the Navbar here */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#202225] py-20 border-b border-[#40444b]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#8e6bff]">
              {translate('title', 'hero')}
            </h1>
            <p className="text-xl mb-8 text-[#dcddde]">
              {translate('description', 'hero')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <Button 
                  className="bg-[#8e6bff] hover:bg-[#7b5ce5] text-white px-6 py-3 rounded-md font-semibold text-lg"
                  onClick={() => router.push('/content')}
                >
                   {translate('contentGeneration', 'hero')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button 
                  className="bg-[#8e6bff] hover:bg-[#7b5ce5] text-white px-6 py-3 rounded-md font-semibold text-lg"
                  onClick={() => router.push('/login')}
                >
                  {translate('getStarted', 'hero')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              <Button 
                variant="outline" 
                className="bg-transparent border-2 border-[#8e6bff] text-[#8e6bff] hover:bg-[#8e6bff]/10 px-6 py-3 rounded-md font-semibold text-lg"
              >
                {translate('learnMore', 'hero')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#36393f]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">{translate('keyFeatures', 'features')}</h2>
          <p className="text-[#b9bbbe] text-center mb-12 max-w-2xl mx-auto">{translate('discover', 'features')}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileText size={32} />}
              title={translate('pdfGeneration', 'features')}
              description={translate('pdfGenerationDescription', 'features')}
              highlighted={true}
            />
            <FeatureCard 
              icon={<Book size={32} />}
              title={translate('customLessonPlans', 'features')}
              description={translate('customLessonPlansDescription', 'features')}
            />
            <FeatureCard 
              icon={<Brain size={32} />}
              title={translate('aiPoweredContent', 'features')}
              description={translate('aiPoweredContentDescription', 'features')}
            />
            <FeatureCard 
              icon={<Users size={32} />}
              title={translate('collaborativeLearning', 'features')}
              description={translate('collaborativeLearningDescription', 'features')}
            />
            <FeatureCard 
              icon={<CheckCircle size={32} />}
              title={translate('assessmentTools', 'features')}
              description={translate('assessmentToolsDescription', 'features')}
            />
            <FeatureCard 
              icon={<FileText size={32} />}
              title={translate('customizableTemplates', 'features')}
              description={translate('customizableTemplatesDescription', 'features')}
            />
          </div>
        </div>
      </section>

      {/* Demo Section - NEW */}
      <section className="py-16 bg-[#2f3136] border-y border-[#40444b]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-[#8e6bff]">{translate('oneClickPdfGeneration', 'demo')}</h2>
              <p className="text-[#dcddde] mb-6">
                {translate('oneClickPdfGenerationDescription', 'demo')}
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="text-[#8e6bff] mr-2 mt-1"><CheckCircle size={18} /></div>
                  <span className="text-[#dcddde]">{translate('professionallyFormattedDocuments', 'demo')}</span>
                </li>
                <li className="flex items-start">
                  <div className="text-[#8e6bff] mr-2 mt-1"><CheckCircle size={18} /></div>
                  <span className="text-[#dcddde]">{translate('instantDownloads', 'demo')}</span>
                </li>
                <li className="flex items-start">
                  <div className="text-[#8e6bff] mr-2 mt-1"><CheckCircle size={18} /></div>
                  <span className="text-[#dcddde]">{translate('customizableStylingOptions', 'demo')}</span>
                </li>
              </ul>
              <Button 
                className="bg-[#8e6bff] hover:bg-[#7b5ce5] text-white px-6 py-3 rounded-md font-semibold"
                onClick={() => router.push('/content')}
              >
                {translate('tryItNow', 'demo')} <Download className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="md:w-1/2 bg-[#202225] p-6 rounded-lg shadow-lg border border-[#40444b]">
              <div className="bg-[#36393f] rounded-lg p-4 shadow-sm border border-[#40444b]">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-bold text-lg text-white">{translate('quantumPhysicsLesson', 'demo')}</div>
                  <div className="text-xs bg-[#8e6bff] bg-opacity-20 text-[#8e6bff] px-2 py-1 rounded border border-[#8e6bff] border-opacity-20">{translate('advanced', 'demo')}</div>
                </div>
                <div className="text-sm text-[#b9bbbe] mb-4">
                  {translate('quantumPhysicsLessonDescription', 'demo')}
                </div>
                <div className="border-t border-[#40444b] pt-4 mt-2">
                  <Button 
                    className="w-full flex items-center justify-center gap-2 bg-[#8e6bff] bg-opacity-10 text-[#8e6bff] hover:bg-opacity-20 border border-[#8e6bff] border-opacity-20"
                  >
                    <Download className="h-4 w-4" />
                    {translate('downloadAsPdf', 'demo')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-[#36393f]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">{translate('howItWorks', 'howItWorks')}</h2>
          <div className="max-w-2xl mx-auto">
            <Step 
              number="1" 
              title={translate('chooseYourTopic', 'howItWorks')} 
              description={translate('chooseYourTopicDescription', 'howItWorks')}
            />
            <Step 
              number="2" 
              title={translate('customizeOptions', 'howItWorks')} 
              description={translate('customizeOptionsDescription', 'howItWorks')}
            />
            <Step 
              number="3" 
              title={translate('generateContent', 'howItWorks')} 
              description={translate('generateContentDescription', 'howItWorks')}
            />
            <Step 
              number="4" 
              title={translate('downloadAsPdf', 'howItWorks')} 
              description={translate('downloadAsPdfDescription', 'howItWorks')}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#8e6bff] bg-opacity-10 border-y border-[#8e6bff] border-opacity-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#8e6bff]">{translate('readyToTransform', 'cta')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-[#dcddde]">
            {translate('joinThousands', 'cta')}
          </p>
          {isAuthenticated ? (
            <Button 
              className="bg-[#8e6bff] hover:bg-[#7b5ce5] text-white px-8 py-3 rounded-md font-semibold text-lg"
              onClick={() => router.push('/content')}
            >
              {translate('createContentNow', 'cta')}
            </Button>
          ) : (
            <Button 
              className="bg-[#8e6bff] hover:bg-[#7b5ce5] text-white px-8 py-3 rounded-md font-semibold text-lg"
              onClick={() => router.push('/register')}
            >
              {translate('signUpForFree', 'cta')}
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#202225] text-white py-12 border-t border-[#40444b]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#8e6bff]">BrightMind</h3>
              <p className="mb-4 text-[#dcddde]">{translate('footerDescription', 'footer')}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#8e6bff]">{translate('quickLinks', 'footer')}</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-[#dcddde] hover:text-white">{translate('home', 'footer')}</Link></li>
                <li><Link href="/content" className="text-[#dcddde] hover:text-white">{translate('content', 'footer')}</Link></li>
                <li><Link href="/profile" className="text-[#dcddde] hover:text-white">{translate('myProfile', 'footer')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#8e6bff]">{translate('contact', 'footer')}</h3>
              <p className="text-[#dcddde]">{translate('supportEmail', 'footer')}</p>
            </div>
          </div>
          <div className="border-t border-[#40444b] mt-8 pt-8 text-center">
            <p className="text-[#b9bbbe]">© 2025 BrightMind. {translate('allRightsReserved', 'footer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}