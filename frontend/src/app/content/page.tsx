'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext'; // Import useLanguage hook
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import QuizButton from '../../components/QuizButton';
import AskAIButton from '../../components/AskAIButton';
import RecommendedVideos from '../../components/RecommendedVideo';
import PDFGenerator from '../../components/PDFGenerator';

interface Content {
  topic: string;
  summary: string;
  sections: Section[];
  references?: string[]; // Add this property
  difficulty_level?: string; // Add this property
}

interface Section {
  title: string;
  content: string;
  key_points: string[];
}

// Update the ContentHistory interface to match the API field name
interface ContentHistory {
  id: number;
  topic: string;
  difficulty_level: string; // Changed from 'difficulty' to 'difficulty_level'
  created_at: string;
}

const ContentGenerationPage = () => {
  // Add this to get translations
  const { translate } = useLanguage();
  
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<ContentHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [answerResults, setAnswerResults] = useState<{[key: number]: boolean}>({});

  const { isAuthenticated, getToken } = useAuth();

  // Add this code near the top of your component
  useEffect(() => {
    if (searchHistory.length > 0) {
      console.log('Search history data:', searchHistory);
    }
  }, [searchHistory]);

  // Add this code at the top of your component to debug the API response
  useEffect(() => {
    if (searchHistory.length > 0) {
      console.log('API response data:', searchHistory);
      // Check if difficulty values exist
      const hasDifficulty = searchHistory.some(item => item.difficulty_level);
      console.log('Has difficulty values:', hasDifficulty);
    }
  }, [searchHistory]);

  // Fetch user search history from API on component mount
  useEffect(() => {
    const fetchUserContents = async () => {
      setHistoryLoading(true);
      try {
        const token = await getToken();
        if (!token) {
          console.error('Authentication requirose to fetch history');
          return;
        }

        const response = await fetch('http://localhost:8000/api/user-contents/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch user contents');
          return;
        }

        const data = await response.json();
        setSearchHistory(data);
      } catch (err) {
        console.error('Error fetching user contents:', err);
      } finally {
        setHistoryLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserContents();
    }
  }, [isAuthenticated, getToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setError('');
    setContent(null);
    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        setError('Authentication requirose. Please log in again.');
        return;
      }

      const response = await fetch('http://localhost:8000/api/generate-content/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, difficulty }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate content.');
        return;
      }

      const data = await response.json();
      setContent(data);

      // Refresh search history after generating new content
      const historyResponse = await fetch('http://localhost:8000/api/user-contents/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setSearchHistory(historyData);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurrose.');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryItemClick = (historyTopic: string) => {
    setTopic(historyTopic);
  };

  // Format date string for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get visible history items based on showAllHistory state
  const visibleHistory = showAllHistory ? searchHistory : searchHistory.slice(0, 5);

  const handleQuizGenerated = (questions: any[]) => {
    setQuizQuestions(questions);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  // Example usage in parent component
  const handleAnswerSelection = (questionIndex: number, selectedOption: 'a' | 'b' | 'c' | 'd') => {
    if (!quizQuestions[questionIndex]) return;
    
    const question = quizQuestions[questionIndex];
    
    // Method 1: Using the checkAnswer method
    const isCorrect = question.checkAnswer(selectedOption);
    
    // Method 2: Direct comparison if you prefer
    const selectedText = question[`option_${selectedOption}`];
    const isCorrectAlt = selectedText === question.answer_string;
    
    // Update the user's answer
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption.toUpperCase()
    }));
  };

  // Get the current content to pass to the AskAIButton
  const currentContentText = content ? 
    `Topic: ${content.topic}\n\nSummary: ${content.summary}\n\n${content.sections.map(section => 
      `${section.title}:\n${section.content}\nKey Points:\n${section.key_points.join('\n')}`
    ).join('\n\n')}` : '';

  return (
    <div className="min-h-screen bg-[#36393f] text-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#8e6bff]">
          {translate('title', 'contentPage')}
        </h1>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search history sidebar */}
            <div className="lg:w-1/4 lg:sticky lg:top-4 lg:self-start">
              <div className="bg-[#2f3136] rounded-xl shadow-lg p-4 border border-[#202225] overflow-hidden">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#40444b] flex items-center">
                  <span className="text-[#8e6bff] mr-2">📚</span> {translate('historyTitle', 'contentPage')}
                </h2>
                
                {historyLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="animate-spin h-6 w-6 border-3 border-[#8e6bff] border-t-transparent rounded-full"></div>
                  </div>
                ) : searchHistory.length > 0 ? (
                  <>
                    <ul className="space-y-4">
                      {visibleHistory.map((item) => (
                        <li key={item.id} className="bg-[#202225] rounded-lg p-3 hover:bg-[#2c2e33] transition-all duration-200 border border-[#40444b] hover:border-[#8e6bff]">
                          <button
                            onClick={() => handleHistoryItemClick(item.topic)}
                            className="w-full text-left"
                          >
                            <h3 className="text-white font-semibold mb-1 truncate hover:text-[#8e6bff] transition-colors">
                              {item.topic}
                            </h3>
                            <div className="flex justify-between items-center mt-2">
                              <span className="bg-[#8e6bff] bg-opacity-30 text-white px-3 py-1 rounded-md text-xs font-medium capitalize border border-[#8e6bff] border-opacity-30 shadow-sm">
                                {item.difficulty_level ? item.difficulty_level : translate('defaultDifficulty', 'contentPage')}
                              </span>
                              <span className="text-xs text-[#b9bbbe]">{formatDate(item.created_at)}</span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                    
                    {searchHistory.length > 5 && (
                      <button 
                        onClick={() => setShowAllHistory(!showAllHistory)}
                        className="mt-4 text-xs text-[#8e6bff] hover:text-white flex items-center justify-center w-full py-2 border border-[#40444b] rounded-lg hover:bg-[#36393f] transition-colors"
                      >
                        {showAllHistory ? `↑ ${translate('showLess', 'contentPage')}` : `↓ ${translate('showAll', 'contentPage')} (${searchHistory.length})`}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-[#b9bbbe] italic text-center py-8 bg-[#202225] bg-opacity-30 rounded-lg">
                    <p>{translate('noHistory', 'contentPage')}</p>
                    <p className="text-xs mt-2">{translate('generateFirstContent', 'contentPage')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Main content area */}
            <div className="lg:w-3/4">
              <div className="bg-[#2f3136] rounded-xl shadow-lg border border-[#202225] overflow-hidden mb-6">
                <div className="p-6 border-b border-[#40444b]">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="text-[#8e6bff] mr-2">✨</span> {translate('generateNewContent', 'contentPage')}
                  </h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="topic" className="block text-[#dcddde] text-sm font-bold mb-2">
                        {translate('topicLabel', 'contentPage')}
                      </label>
                      <input
                        type="text"
                        id="topic"
                        className="w-full py-3 px-4 bg-[#202225] text-white rounded-lg border border-[#40444b] focus:border-[#8e6bff] focus:ring-1 focus:ring-[#8e6bff] focus:outline-none transition-colors"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder={translate('topicPlaceholder', 'contentPage')}
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="difficulty" className="block text-[#dcddde] text-sm font-bold mb-2">
                        {translate('difficultyLabel', 'contentPage')}
                      </label>
                      <select
                        id="difficulty"
                        className="w-full py-3 px-4 bg-[#202225] text-white rounded-lg border border-[#40444b] focus:border-[#8e6bff] focus:outline-none cursor-pointer"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                      >
                        <option value="beginner">{translate('beginner', 'contentPage')}</option>
                        <option value="intermediate">{translate('intermediate', 'contentPage')}</option>
                        <option value="advanced">{translate('advanced', 'contentPage')}</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-[#8e6bff] hover:bg-[#7b5ce5] text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8e6bff] focus:ring-offset-[#2f3136]"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          <span>{translate('generating', 'contentPage')}</span>
                        </div>
                      ) : (
                        translate('generateButton', 'contentPage')
                      )}
                    </button>
                  </form>
                </div>

                {error && (
                  <div className="mx-6 my-4 text-rose-300 p-4 bg-rose-900 bg-opacity-20 rounded-lg border border-rose-500">
                    <p className="flex items-start">
                      <span className="text-rose-400 mr-2">⚠️</span>
                      {error}
                    </p>
                  </div>
                )}
              </div>

              {/* Place RecommendedVideos BEFORE the content */}
              {content && (
                <RecommendedVideos topic={content.topic} />
              )}

              {/* Then display the content */}
              {content && (
                <div className="bg-[#2f3136] rounded-xl shadow-lg border border-[#202225] overflow-hidden mb-6">
                  {/* Content Header */}
                  <div className="bg-[#202225] p-6">
                    <h2 className="text-2xl font-bold text-[#8e6bff] mb-3">{content.topic}</h2>
                    <p className="text-[#dcddde] leading-relaxed">{content.summary}</p>
                  </div>

                  {/* Content Sections */}
                  <div className="divide-y divide-[#40444b]">
                    {content.sections &&
                      content.sections.map((section: Section, index: number) => (
                        <div key={index} className="p-6 hover:bg-[#36393f] transition-colors">
                          <h3 className="text-xl font-semibold mb-4 text-[#8e6bff] flex items-baseline">
                            <span className="bg-[#8e6bff] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">
                              {index + 1}
                            </span>
                            <span>{section.title}</span>
                          </h3>
                          <p className="mb-5 text-[#dcddde] leading-relaxed pl-10">{section.content}</p>
                          
                          {section.key_points && section.key_points.length > 0 && (
                            <div className="mt-4 bg-[#202225] rounded-xl p-4 ml-10">
                              <h4 className="text-sm uppercase text-[#b9bbbe] font-bold mb-3 flex items-center">
                                <span className="mr-2">🔑</span> {translate('keyPoints', 'contentPage')}
                              </h4>
                              <ul className="space-y-2">
                                {section.key_points.map((point: string, i: number) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-[#8e6bff] mr-2 font-bold">•</span>
                                    <span className="text-[#dcddde]">{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Quiz section remains after the content */}
              {content && (
                <div className="mt-6 bg-[#2f3136] rounded-xl shadow-lg border border-[#202225] overflow-hidden">
                  <div className="p-6 border-b border-[#40444b] flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center">
                      <span className="text-[#8e6bff] mr-2">🧠</span> {translate('quiz', 'contentPage')}
                    </h3>
                    
                    <QuizButton 
                      content={content}
                      difficulty={difficulty}
                      onQuizGenerated={handleQuizGenerated}
                    />
                  </div>
                  
                  {quizQuestions.length > 0 && (
                    <div className="p-6">
                      {/* Quiz header with progress information */}
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-semibold flex items-center">
                          <span className="text-[#8e6bff] mr-2">📝</span> 
                          {translate('quizQuestions', 'contentPage')}
                        </h4>
                        {!quizSubmitted && (
                          <div className="text-sm text-[#b9bbbe]">
                            {translate('answered', 'contentPage')} {Object.keys(userAnswers).length} {translate('of', 'contentPage')} {quizQuestions.length}
                          </div>
                        )}
                      </div>

                      {/* Progress bar */}
                      {!quizSubmitted && (
                        <div className="w-full h-2 bg-[#40444b] rounded-full mb-6 overflow-hidden">
                          <div 
                            className="h-full bg-[#8e6bff] rounded-full transition-all duration-300"
                            style={{ width: `${(Object.keys(userAnswers).length / quizQuestions.length) * 100}%` }}
                          ></div>
                        </div>
                      )}

                      <div className="space-y-6">
                        {quizQuestions.map((question, index) => (
                          <div 
                            key={index} 
                            className={`quiz-question bg-[#202225] rounded-lg p-5 border transition-all duration-300 ${
                              quizSubmitted 
                                ? answerResults[index] 
                                  ? 'border-emerald-500 shadow-md shadow-emerald-900/20' 
                                  : 'border-rose-500 shadow-md shadow-rose-900/20' 
                                : 'border-[#40444b] hover:border-[#8e6bff]'
                            }`}
                          >
                            {/* Question header with number and result indicator */}
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-semibold ${
                                  quizSubmitted 
                                    ? answerResults[index] ? 'bg-emerald-500' : 'bg-rose-500'
                                    : 'bg-[#8e6bff]'
                                }`}>
                                  {index + 1}
                                </div>
                                <p className="font-medium text-lg">{question.question}</p>
                              </div>
                              {quizSubmitted && (
                                <span className={`text-xl ${answerResults[index] ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {answerResults[index] ? '✓' : '✗'}
                                </span>
                              )}
                            </div>

                            {/* Answer options with improved UI */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
                              {['a', 'b', 'c', 'd'].map((option) => (
                                <div 
                                  key={option}
                                  onClick={() => {
                                    if (!quizSubmitted) {
                                      setUserAnswers(prev => ({
                                        ...prev,
                                        [index]: option.toUpperCase()
                                      }));
                                    }
                                  }}
                                  className={`p-3 rounded-lg border transition-all duration-200 transform ${
                                    userAnswers[index] === option.toUpperCase() && !quizSubmitted
                                      ? 'scale-102 -translate-y-1' : ''
                                  } ${
                                    userAnswers[index] === option.toUpperCase()
                                      ? quizSubmitted
                                        ? option.toUpperCase() === question.answer_option.toUpperCase()
                                          ? 'bg-emerald-500 bg-opacity-20 border-emerald-500'
                                          : 'bg-rose-500 bg-opacity-20 border-rose-500'
                                        : 'bg-[#8e6bff] bg-opacity-20 border-[#8e6bff]'
                                      : quizSubmitted && option.toUpperCase() === question.answer_option.toUpperCase()
                                        ? 'bg-emerald-500 bg-opacity-10 border-emerald-500 border-dashed'
                                        : 'bg-[#36393f] border-[#40444b] hover:bg-[#2c2e33]'
                                  } ${!quizSubmitted ? 'cursor-pointer hover:border-[#8e6bff] hover:shadow-sm' : ''}`}
                                >
                                  <div className="flex items-center">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 ${
                                      userAnswers[index] === option.toUpperCase()
                                        ? quizSubmitted
                                          ? option.toUpperCase() === question.answer_option.toUpperCase()
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-rose-500 text-white'
                                          : 'bg-[#8e6bff] text-white'
                                        : quizSubmitted && option.toUpperCase() === question.answer_option.toUpperCase()
                                          ? 'bg-emerald-500 bg-opacity-30 text-emerald-200 border border-emerald-500'
                                          : 'bg-[#40444b] text-[#b9bbbe]'
                                    }`}>
                                      {option.toUpperCase()}
                                    </span>
                                    <span className="flex-1">{question[`option_${option}`]}</span>
                                    {quizSubmitted && option.toUpperCase() === question.answer_option.toUpperCase() && (
                                      <span className="ml-2 text-emerald-400 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {translate('correct', 'contentPage')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Feedback for wrong answers */}
                            {quizSubmitted && !answerResults[index] && (
                              <div className="mt-0 bg-opacity-20 rounded-lg p-3 ml-11">
                                <p className="text-yellow-300 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  The correct answer was: <span className="font-semibold ml-1">{question.answer_string}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Quiz actions - Submit or Results */}
                      {!quizSubmitted ? (
                        <div className="mt-8 flex justify-between items-center">
                          <p className="text-sm text-[#b9bbbe]">
                            {Object.keys(userAnswers).length < quizQuestions.length ? 
                              `${translate('remainingQuestions', 'contentPage')} ${quizQuestions.length - Object.keys(userAnswers).length} ${translate('remainingQuestionsEnd', 'contentPage')}` : 
                              translate('readyToSubmit', 'contentPage')}
                          </p>
                          <button
                            onClick={() => {
                              // Calculate score
                              let score = 0;
                              const results: {[key: number]: boolean} = {};
                              
                              quizQuestions.forEach((question, index) => {
                                if (userAnswers[index]) {
                                  const correctOption = question.answer_option.toUpperCase();
                                  const isCorrect = userAnswers[index] === correctOption;
                                  
                                  results[index] = isCorrect;
                                  if (isCorrect) {
                                    score++;
                                  }
                                } else {
                                  // Mark unanswered questions as incorrect
                                  results[index] = false;
                                }
                              });
                              
                              setAnswerResults(results);
                              setQuizScore(score);
                              setQuizSubmitted(true);
                            }}
                            disabled={Object.keys(userAnswers).length < quizQuestions.length}
                            className="py-2 px-6 bg-[#8e6bff] hover:bg-[#7b5ce5] text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#8e6bff] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {translate('submitQuiz', 'contentPage')}
                          </button>
                        </div>
                      ) : (
                        <div className="mt-8 bg-[#202225] rounded-lg p-6 border border-[#40444b]">
                          <h4 className="text-lg font-semibold mb-4">{translate('quizResults', 'contentPage')}</h4>
                          
                          {/* Score display with percentage */}
                          <div className="flex items-center mb-6">
                            <div className="relative w-24 h-24 mr-6">
                              <svg className="w-24 h-24" viewBox="0 0 36 36">
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#40444b"
                                  strokeWidth="3"
                                />
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke={quizScore! / quizQuestions.length >= 0.7 ? "#4ade80" : quizScore! / quizQuestions.length >= 0.4 ? "#facc15" : "#ef4444"}
                                  strokeWidth="3"
                                  strokeDasharray={`${(quizScore! / quizQuestions.length) * 100}, 100`}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xl font-bold">
                                {Math.round((quizScore! / quizQuestions.length) * 100)}%
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-2xl font-bold text-white">
                                {quizScore} / {quizQuestions.length} {translate('correctScore', 'contentPage')}
                              </p>
                              <p className="text-[#b9bbbe] mt-1">
                                {quizScore! / quizQuestions.length >= 0.8 ? 
                                  translate('excellentFeedback', 'contentPage') : 
                                  quizScore! / quizQuestions.length >= 0.6 ? 
                                    translate('goodFeedback', 'contentPage') : 
                                    translate('improveFeedback', 'contentPage')}
                              </p>
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => {
                                setUserAnswers({});
                                setQuizSubmitted(false);
                                setQuizScore(null);
                              }}
                              className="py-2 px-6 bg-[#8e6bff] hover:bg-[#7b5ce5] text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#8e6bff] flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                              </svg>
                              {translate('tryAgain', 'contentPage')}
                            </button>
                            
                            <button
                              onClick={() => {
                                // Scroll to the first incorrect answer
                                const firstIncorrectIndex = Object.entries(answerResults)
                                  .find(([_, isCorrect]) => !isCorrect)?.[0];
                                    
                                if (firstIncorrectIndex) {
                                  document.querySelectorAll('.quiz-question')[Number(firstIncorrectIndex)]?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center'
                                  });
                                }
                              }}
                              className="py-2 px-6 bg-[#40444b] hover:bg-[#36393f] text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#8e6bff] flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                              {translate('reviewAnswers', 'contentPage')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {content && (
                <div className="mt-8">
                <h2 className="text-2xl font-bold">{translate('generatedContent', 'contentPage')}</h2>
                
                <PDFGenerator
                  topic={content.topic}
                  summary={content.summary}
                  sections={content.sections}
                  references={content.references || []}
                  difficulty_level={content.difficulty_level || 'beginner'}
                  questions={quizQuestions || []}
                />
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AskAIButton currentContent={currentContentText} />
    </div>
  );
};

export default ContentGenerationPage;