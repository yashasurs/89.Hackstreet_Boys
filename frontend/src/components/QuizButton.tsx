'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Define a type for quiz question objects
interface QuizQuestion {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer_option: string;
  answer_string: string;
  [key: string]: string; // For accessing options dynamically with `option_${selectedOption}`
}

interface QuizButtonProps {
  content: any;
  difficulty: string;
  onQuizGenerated: (questions: any[]) => void;
}

const QuizButton: React.FC<QuizButtonProps> = ({
  content,
  difficulty,
  onQuizGenerated
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { getToken } = useAuth();

  const generateQuiz = async () => {
    if (!content) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = await getToken();
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const response = await fetch('http://localhost:8000/api/generate-questions/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: content.summary + ' ' + content.sections.map((s: any) => s.content).join(' '),
          num_questions: 10,
          difficulty: difficulty
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate quiz.');
        return;
      }

      const data = await response.json();
      
      // Enhance questions with validation logic
      const enhancedQuestions = data.questions.map((question: QuizQuestion) => ({
        ...question,
        // Add a validation method to each question
        checkAnswer: (selectedOption: string) => {
          // Get the text of the selected option
          const selectedText = question[`option_${selectedOption}`];
          // Compare with answer_string - considering any option that matches answer_string as correct
          return selectedText === question.answer_string;
        }
      }));
      
      // Pass the enhanced quiz questions back to the parent component
      onQuizGenerated(enhancedQuestions);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={generateQuiz}
        disabled={loading || !content}
        className="py-2 px-4 bg-[#8e6bff] hover:bg-[#7b5ce5] text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#8e6bff] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        {loading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            <span>Generating Quiz...</span>
          </>
        ) : (
          <>
            <span className="mr-1">🧠</span> Test Your Knowledge
          </>
        )}
      </button>
      
      {error && (
        <div className="mt-2 text-red-300 text-sm">
          <p className="flex items-start">
            <span className="text-red-400 mr-1">⚠️</span>
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizButton;