import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { MessageSquare, X, Send, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface AskAIButtonProps {
  currentContent: string;
}

const AskAIButton: React.FC<AskAIButtonProps> = ({ currentContent }) => {
  const { isAuthenticated } = useAuth();
  const { translate } = useLanguage();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('button[aria-label="Ask AI"]')) {
        setIsPanelOpen(false);
      }
    };

    if (isPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPanelOpen]);

  const handleOpenPanel = () => {
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    // Reset state
    setQuestion('');
    setAnswer('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    if (!currentContent) {
      setError(translate('noContentError', 'askAI'));
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Make API call to your backend
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          context: currentContent,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get answer');
      }
      
      const data = await response.json();
      setAnswer(data.answer);
    } catch (err) {
      setError(translate('errorMessage', 'askAI'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (suggestedQuestion: string) => {
    setQuestion(suggestedQuestion);
    // Auto-submit if desired
    // handleSubmit(new Event('submit') as unknown as React.FormEvent);
  };

  return (
    <>
      <button
        onClick={handleOpenPanel}
        className="fixed bottom-8 right-8 bg-[#8e6bff] hover:bg-[#7b5ce5] text-white p-4 rounded-full shadow-lg z-40"
        aria-label={translate('buttonLabel', 'askAI')}
      >
        <MessageSquare size={24} />
      </button>

      <div 
        className={`fixed top-0 right-0 h-full w-96 max-w-full bg-[#2f3136] shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        ref={panelRef}
      >
        {/* Panel Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#40444b]">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <MessageSquare className="w-5 h-5 text-[#8e6bff] mr-2" />
            {translate('assistantTitle', 'askAI')}
          </h2>
          <button 
            onClick={handleClosePanel}
            className="text-[#b9bbbe] hover:text-white"
            aria-label={translate('closeButton', 'askAI')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Panel Content */}
        <div className="p-4 h-[calc(100%-8rem)] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-20 text-red-300 rounded-md border border-red-800">
              {error}
            </div>
          )}
          
          {answer && (
            <div className="mb-4 p-4 bg-[#36393f] rounded-md border border-[#40444b]">
              <p className="text-[#dcddde] whitespace-pre-wrap">{answer}</p>
            </div>
          )}
          
          {!answer && !isLoading && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-[#b9bbbe] mb-2">
                {translate('suggestions', 'askAI')}
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => handleSuggestedQuestion(translate('suggestedQuestion1', 'askAI'))}
                  className="w-full text-left p-2 bg-[#202225] hover:bg-[#36393f] rounded flex items-center text-[#dcddde] transition-colors"
                >
                  <span className="flex-1">{translate('suggestedQuestion1', 'askAI')}</span>
                  <ChevronRight size={16} className="text-[#8e6bff]" />
                </button>
                <button 
                  onClick={() => handleSuggestedQuestion(translate('suggestedQuestion2', 'askAI'))}
                  className="w-full text-left p-2 bg-[#202225] hover:bg-[#36393f] rounded flex items-center text-[#dcddde] transition-colors"
                >
                  <span className="flex-1">{translate('suggestedQuestion2', 'askAI')}</span>
                  <ChevronRight size={16} className="text-[#8e6bff]" />
                </button>
                <button 
                  onClick={() => handleSuggestedQuestion(translate('suggestedQuestion3', 'askAI'))}
                  className="w-full text-left p-2 bg-[#202225] hover:bg-[#36393f] rounded flex items-center text-[#dcddde] transition-colors"
                >
                  <span className="flex-1">{translate('suggestedQuestion3', 'askAI')}</span>
                  <ChevronRight size={16} className="text-[#8e6bff]" />
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8e6bff]"></div>
              <span className="ml-3 text-[#b9bbbe]">{translate('loading', 'askAI')}</span>
            </div>
          )}
        </div>

        {/* Panel Footer with Input */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[#40444b] bg-[#2f3136] p-4">
          {answer ? (
            <Button
              onClick={() => setAnswer('')}
              className="w-full bg-[#4f545c] hover:bg-[#5d6269] text-white border-none"
              variant="outline"
            >
              {translate('askAgainButton', 'askAI')}
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={translate('placeholder', 'askAI')}
                className="flex-1 p-2 bg-[#40444b] border border-[#202225] focus:border-[#8e6bff] rounded-md text-white focus:outline-none resize-none"
                rows={2}
              />
              <Button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="self-end bg-[#8e6bff] hover:bg-[#7b5ce5]"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  </span>
                ) : (
                  <Send size={16} />
                )}
                <span className="sr-only">{translate('askButton', 'askAI')}</span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default AskAIButton;