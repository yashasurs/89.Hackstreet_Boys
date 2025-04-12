import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PDFGeneratorProps {
  topic: string;
  summary: string;
  sections: {
    title: string;
    content: string;
    key_points: string[];
  }[];
  references: string[];
  difficulty_level: string;
  questions?: {
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    answer_option: string;
    answer_string: string;
  }[];
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  topic,
  summary,
  sections,
  references,
  difficulty_level,
  questions = [],
}) => {
  const { getToken } = useAuth();
  const { translate } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required to generate PDF');
      }
      
      const requestData = {
        topic,
        summary,
        sections,
        references,
        difficulty_level,
        questions,
        style: {
          textColor: '#000000',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12pt',
          headingColor: '#000000',
          linkColor: '#0000EE',
        }
      };
      
      const response = await fetch('http://localhost:8000/api/generate-lesson-pdf/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.statusText}`);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${topic}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('PDF generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Button 
        onClick={generatePDF} 
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {translate('generatingPdf', 'pdf')}
          </>
        ) : (
          translate('downloadAsPdf', 'pdf')
        )}
      </Button>
      
      {error && (
        <p className="text-red-500 mt-2 text-sm">{error}</p>
      )}
    </div>
  );
};

export default PDFGenerator;