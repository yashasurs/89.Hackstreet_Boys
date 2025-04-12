import React, { useState } from 'react';
import AskAIButton from './AskAIButton';
import { Button } from './ui/button';
import { Wand2 } from 'lucide-react';

interface ContentGeneratorProps {
  content: string;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ content }) => {
  const [generatedPrompt, setGeneratedPrompt] = useState<string | undefined>(undefined);
  
  // Example functions to generate different types of prompts
  const generateSummaryPrompt = () => {
    setGeneratedPrompt(`Summarize the following text in 3-5 key points:\n\n${content.substring(0, 500)}${content.length > 500 ? '...' : ''}`);
  };
  
  const generateAnalysisPrompt = () => {
    setGeneratedPrompt(`Analyze the main themes and concepts in this content:\n\n${content.substring(0, 500)}${content.length > 500 ? '...' : ''}`);
  };
  
  const generateQuestionPrompt = () => {
    setGeneratedPrompt(`Generate 3 questions based on this content:\n\n${content.substring(0, 500)}${content.length > 500 ? '...' : ''}`);
  };

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <Button 
          onClick={generateSummaryPrompt}
          variant="outline"
          className="flex items-center"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Generate Summary
        </Button>
        
        <Button 
          onClick={generateAnalysisPrompt}
          variant="outline"
          className="flex items-center"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Generate Analysis
        </Button>
        
        <Button 
          onClick={generateQuestionPrompt}
          variant="outline"
          className="flex items-center"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Generate Questions
        </Button>
      </div>
      
      {/* Pass the generated content to AskAIButton */}
      <AskAIButton 
        currentContent={content}
        generatedContent={generatedPrompt}
        autoSubmit={true}
      />
    </div>
  );
};

export default ContentGenerator;

import React from 'react';
import AskAIButton from './AskAIButton';

interface ContentContextProviderProps {
  userGeneratedContent: string;
  children?: React.ReactNode;
}

const ContentContextProvider: React.FC<ContentContextProviderProps> = ({ 
  userGeneratedContent,
  children 
}) => {
  return (
    <div className="relative">
      {/* The main content or editor where user creates content */}
      <div className="content-area">
        {children}
      </div>
      
      {/* AI assistant that has access to the user's content */}
      <AskAIButton 
        currentContent={userGeneratedContent}
      />
    </div>
  );
};

export default ContentContextProvider;