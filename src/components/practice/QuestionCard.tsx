
import React, { useState } from 'react';
import { Clock, BookOpen } from 'lucide-react';
import { usePractice } from '@/contexts/PracticeContext';

const QuestionCard: React.FC = () => {
  const { state, submitAnswer } = usePractice();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  if (!state.currentQuestion) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading next question...</p>
        </div>
      </div>
    );
  }

  const handleOptionSelect = async (optionIndex: number) => {
    if (showResult) return;
    
    setSelectedOption(optionIndex);
    setShowResult(true);
    
    await submitAnswer(optionIndex);
    
    // Reset for next question
    setTimeout(() => {
      setSelectedOption(null);
      setShowResult(false);
    }, 1500);
  };

  const getOptionClassName = (optionIndex: number) => {
    const baseClasses = "w-full p-4 text-left border border-gray-300 rounded-lg transition-all duration-200 hover:border-blue-400 hover:bg-blue-50";
    
    if (!showResult) {
      return selectedOption === optionIndex 
        ? `${baseClasses} border-blue-500 bg-blue-100`
        : baseClasses;
    }

    if (optionIndex === state.currentQuestion.correctAnswer) {
      return `${baseClasses} border-green-500 bg-green-100 text-green-800`;
    }
    
    if (selectedOption === optionIndex && optionIndex !== state.currentQuestion.correctAnswer) {
      return `${baseClasses} border-red-500 bg-red-100 text-red-800`;
    }

    return `${baseClasses} opacity-50`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm opacity-90">Question {state.totalAttempted + 1}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm opacity-90">Unlimited Time</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold leading-relaxed">
            {state.currentQuestion.text}
          </h2>
        </div>

        <div className="p-6">
          <div className="grid gap-3">
            {state.currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={showResult}
                className={getOptionClassName(index)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-base">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2">
                {selectedOption === state.currentQuestion.correctAnswer ? (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-sm">✗</span>
                  </div>
                )}
                <span className="text-gray-700">
                  {selectedOption === state.currentQuestion.correctAnswer 
                    ? "Correct! Well done!" 
                    : `Incorrect. The correct answer is ${String.fromCharCode(65 + state.currentQuestion.correctAnswer)}.`
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
