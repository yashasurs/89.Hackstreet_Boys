'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import Navbar from '../../components/Navbar'; // Import the Navbar component

interface Content {
  topic: string;
  summary: string;
  sections: Section[];
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
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<ContentHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

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
          console.error('Authentication required to fetch history');
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
        setError('Authentication required. Please log in again.');
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
      setError(err.message || 'An unexpected error occurred.');
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

  return (
    <div className="min-h-screen bg-[#36393f] text-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#8e6bff]">Content Generation</h1>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search history sidebar */}
            <div className="lg:w-1/4 lg:sticky lg:top-4 lg:self-start">
              <div className="bg-[#2f3136] rounded-xl shadow-lg p-4 border border-[#202225] overflow-hidden">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#40444b] flex items-center">
                  <span className="text-[#8e6bff] mr-2">📚</span> Your History
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
                              {/* More visible difficulty badge */}
                              <span className="bg-[#8e6bff] bg-opacity-30 text-white px-3 py-1 rounded-md text-xs font-medium capitalize border border-[#8e6bff] border-opacity-30 shadow-sm">
                                {item.difficulty_level ? item.difficulty_level : 'Default'}
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
                        {showAllHistory ? '↑ Show less' : `↓ Show all (${searchHistory.length})`}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-[#b9bbbe] italic text-center py-8 bg-[#202225] bg-opacity-30 rounded-lg">
                    <p>No content history found</p>
                    <p className="text-xs mt-2">Generate your first content below</p>
                  </div>
                )}
              </div>
            </div>

            {/* Main content area */}
            <div className="lg:w-3/4">
              <div className="bg-[#2f3136] rounded-xl shadow-lg border border-[#202225] overflow-hidden mb-6">
                <div className="p-6 border-b border-[#40444b]">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="text-[#8e6bff] mr-2">✨</span> Generate New Content
                  </h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="topic" className="block text-[#dcddde] text-sm font-bold mb-2">
                        Topic:
                      </label>
                      <input
                        type="text"
                        id="topic"
                        className="w-full py-3 px-4 bg-[#202225] text-white rounded-lg border border-[#40444b] focus:border-[#8e6bff] focus:ring-1 focus:ring-[#8e6bff] focus:outline-none transition-colors"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter a topic to generate content about..."
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="difficulty" className="block text-[#dcddde] text-sm font-bold mb-2">
                        Difficulty Level:
                      </label>
                      <select
                        id="difficulty"
                        className="w-full py-3 px-4 bg-[#202225] text-white rounded-lg border border-[#40444b] focus:border-[#8e6bff] focus:outline-none cursor-pointer"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
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
                          <span>Generating Content...</span>
                        </div>
                      ) : (
                        'Generate Content'
                      )}
                    </button>
                  </form>
                </div>

                {error && (
                  <div className="mx-6 my-4 text-red-300 p-4 bg-red-900 bg-opacity-20 rounded-lg border border-red-500">
                    <p className="flex items-start">
                      <span className="text-red-400 mr-2">⚠️</span>
                      {error}
                    </p>
                  </div>
                )}
              </div>

              {content && (
                <div className="bg-[#2f3136] rounded-xl shadow-lg border border-[#202225] overflow-hidden">
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
                                <span className="mr-2">🔑</span> Key Points
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerationPage;