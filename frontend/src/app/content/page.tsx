'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Replace with your actual auth library

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

const ContentGenerationPage = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          'Content-Type': 'application/json'
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
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">Content Generation</h1>
      <div className="max-w-lg mx-auto bg-zinc-800 bg-opacity-70 backdrop-blur-md p-6 rounded-lg shadow-md border border-zinc-600">
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label htmlFor="topic" className="block text-gray-300 text-sm font-bold mb-2">
              Topic:
            </label>
            <input
              type="text"
              id="topic"
              className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline bg-zinc-700 text-white"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="difficulty" className="block text-gray-300 text-sm font-bold mb-2">
              Difficulty:
            </label>
            <select
              id="difficulty"
              className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline bg-zinc-700 text-white"
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
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading}
          >
            {loading ? <><span className="animate-spin">&#9696;</span> Generating...</> : 'Generate Content'}
          </button>
        </form>

        {error && <div className="text-red-400 mb-4 p-3 bg-red-900 bg-opacity-20 rounded-md border border-red-600">{error}</div>}

        {content && (
          <div className="mt-6 text-gray-300">
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-500 pb-2">{content.topic}</h2>
            <p className="mb-4">{content.summary}</p>
            {content.sections && content.sections.map((section: Section, index: number) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
                <p className="mb-3">{section.content}</p>
                <ul className="list-disc list-inside">
                  {section.key_points && section.key_points.map((point: string, i: number) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentGenerationPage;