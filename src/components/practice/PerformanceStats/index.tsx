import React from "react";
import { TrendingUp, Target, Zap, CheckCircle, XCircle } from "lucide-react";
import { usePractice } from "@/contexts/PracticeContext";

const PerformanceStats: React.FC = () => {
  const { state } = usePractice();
  const { currentQuestion } = state;

  if (!currentQuestion) return null;

  const {
    accuracy,
    attemptedQuestions,
    correctQuestions,
    currentStreak,
    inCorrectQuestions,
  } = currentQuestion.progress;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Accuracy */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Accuracy</p>
              <p className="text-xl font-bold text-gray-900">
                {accuracy.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Attempted Questions */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Attempted</p>
              <p className="text-xl font-bold text-gray-900">
                {attemptedQuestions}
              </p>
            </div>
          </div>

          {/* Correct Questions */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Correct</p>
              <p className="text-xl font-bold text-gray-900">
                {correctQuestions}
              </p>
            </div>
          </div>

          {/* Incorrect Questions */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Incorrect</p>
              <p className="text-xl font-bold text-gray-900">
                {inCorrectQuestions}
              </p>
            </div>
          </div>

          {/* Current Streak */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-xl font-bold text-gray-900">{currentStreak}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceStats;
