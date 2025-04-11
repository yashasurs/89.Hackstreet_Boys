import React, { useState, useRef, useEffect } from 'react';
import styles from './AskAIButton.module.css';
import { useAuth } from '../contexts/AuthContext';

interface AskAIButtonProps {
  currentContent?: string;
}

const AskAIButton: React.FC<AskAIButtonProps> = ({ currentContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversation, setConversation] = useState<{type: 'user' | 'ai', text: string}[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const responseEndRef = useRef<HTMLDivElement>(null);
  
  const { isAuthenticated, getToken } = useAuth();

  // Scroll to bottom when conversation updates
  useEffect(() => {
    if (responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current && 
        !panelRef.current.contains(event.target as Node) && 
        !(event.target as Element).classList.contains(styles.button)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    
    if (!isAuthenticated) {
      setError('You must be logged in to use this feature.');
      return;
    }

    // Add user message to conversation
    const userMessage = userInput.trim();
    setConversation(prev => [...prev, {type: 'user', text: userMessage}]);
    setUserInput('');
    setIsLoading(true);
    setError('');

    try {
      const token = await getToken();
      
      if (!token) {
        setError('Authentication failed. Please log in again.');
        return;
      }
      
      const requestPayload = {
        question: userMessage,
        ...(currentContent ? { content: currentContent.substring(0, 15000) } : {})
      };
      
      const response = await fetch('http://localhost:8000/api/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(requestPayload),
      });
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized: Please log in to use this feature');
      }

      if (!response.ok) {
        let errorDetail = '';
        try {
          const errorData = await response.text();
          errorDetail = errorData ? `: ${errorData.substring(0, 200)}` : '';
        } catch (e) {
          errorDetail = '';
        }
        
        throw new Error(`Server error (${response.status})${errorDetail}`);
      }

      const data = await response.json();
      const aiResponse = data.answer || 'No response received';
      setResponse(aiResponse);
      
      // Add AI response to conversation
      setConversation(prev => [...prev, {type: 'ai', text: aiResponse}]);
    } catch (err) {
      console.error('Error calling chatbot API:', err);
      setError(err instanceof Error ? err.message : 'Failed to get response from AI. Please try again.');
      
      // Add error to conversation
      if (err instanceof Error) {
        setConversation(prev => [...prev, {type: 'ai', text: `Error: ${err.message}`}]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        className={styles.button}
        onClick={handleButtonClick}
        aria-label="Ask AI"
      >
        <span className={styles.buttonIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </span>
        <span className={styles.buttonText}>Ask AI</span>
      </button>
      
      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.panel} ref={panelRef}>
            <div className={styles.header}>
              <h3>AI Assistant</h3>
              <button 
                className={styles.closeButton} 
                onClick={() => setIsOpen(false)}
                aria-label="Close panel"
              >
                ×
              </button>
            </div>
            <div className={styles.content}>
              {!isAuthenticated ? (
                <div className={styles.unauthorizedMessage}>
                  <p>You need to be logged in to use this feature.</p>
                  <button 
                    className={styles.loginButton}
                    onClick={() => window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)}
                  >
                    Log In
                  </button>
                </div>
              ) : (
                <>
                  {currentContent && (
                    <div className={styles.contentReference}>
                      <p className={styles.contentReferenceLabel}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.infoIcon}>
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 16v-4"></path>
                          <path d="M12 8h.01"></path>
                        </svg>
                        AI will reference current page content
                      </p>
                    </div>
                  )}
                  
                  <div className={styles.conversationContainer}>
                    {conversation.length === 0 ? (
                      <div className={styles.emptyConversation}>
                        <div className={styles.aiWelcome}>
                          <div className={styles.aiAvatar}>AI</div>
                          <div className={styles.aiMessageContent}>
                            <p>Hello! I'm your AI assistant. How can I help you with this content?</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      conversation.map((message, index) => (
                        <div 
                          key={index} 
                          className={message.type === 'user' ? styles.userMessage : styles.aiMessage}
                        >
                          <div className={message.type === 'user' ? styles.userAvatar : styles.aiAvatar}>
                            {message.type === 'user' ? 'You' : 'AI'}
                          </div>
                          <div className={
                            message.type === 'user' 
                              ? styles.userMessageContent 
                              : styles.aiMessageContent
                          }>
                            <p>{message.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                    
                    {isLoading && (
                      <div className={styles.aiMessage}>
                        <div className={styles.aiAvatar}>AI</div>
                        <div className={styles.aiMessageContent}>
                          <p className={styles.loading}>Thinking<span className={styles.loadingDots}></span></p>
                        </div>
                      </div>
                    )}
                    <div ref={responseEndRef} />
                  </div>
                  
                  <div className={styles.inputContainer}>
                    <textarea 
                      placeholder={currentContent 
                        ? "Ask a question about this content..." 
                        : "Type your question here..."}
                      className={styles.textarea}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                    />
                    <button 
                      className={styles.submitButton} 
                      onClick={handleSubmit}
                      disabled={isLoading || !userInput.trim()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AskAIButton;