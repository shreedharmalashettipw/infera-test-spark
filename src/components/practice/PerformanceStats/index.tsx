import React from "react";
import { TrendingUp, Target, Zap } from "lucide-react";
import { usePractice } from "@/contexts/PracticeContext";

const PerformanceStats: React.FC = () => {
  const { state } = usePractice();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Accuracy</p>
              <p className="text-xl font-bold text-gray-900">
                {state.overallAccuracy.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-xl font-bold text-gray-900">
                {state.currentStreak}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Attempted</p>
              <p className="text-xl font-bold text-gray-900">
                {state.totalAttempted}
              </p>
            </div>
          </div>
        </div>

        {/* <div className="text-right">
          <p className="text-sm text-gray-600">Session Progress</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                style={{ width: `${Math.min(state.overallAccuracy, 100)}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900">
              {state.totalCorrect}/{state.totalAttempted}
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PerformanceStats;
