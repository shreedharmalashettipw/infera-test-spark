import React from "react";
import { usePractice } from "@/contexts/PracticeContext";
import TradingViewChart from "@/components/analytics/TradingViewChart";
import CandlestickChart from "@/components/analytics/CandlestickChart";
import { ArrowLeft, BarChart3, TrendingUp, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryParam } from "@/hooks/useQueryParam";

const Analytics: React.FC = () => {
  const { state } = usePractice();
  const testId = useQueryParam("testId") as string;

  // Transform performance data for chart
  const chartData = state.performance.map((item, index) => ({
    timestamp: item.timestamp,
    correct: item.correct ? 1 : 0,
    incorrect: item.correct ? 0 : 1,
    accuracy: item.accuracy,
    formattedTime: new Date(item.timestamp).toLocaleTimeString(),
  }));

  // Calculate additional stats
  const getStreakStats = () => {
    let maxStreak = 0;
    let currentStreak = 0;

    state.performance.forEach((item) => {
      if (item.correct) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    return { maxStreak, currentStreak: state.currentStreak };
  };

  const { maxStreak } = getStreakStats();

  const getSubjectPerformance = () => {
    const subjects: {
      [key: string]: { correct: number; total: number; name: string };
    } = {};

    state.performance.forEach((item) => {
      if (!subjects[item.subjectId]) {
        subjects[item.subjectId] = {
          correct: 0,
          total: 0,
          name: item.subjectId,
        };
      }
      subjects[item.subjectId].total++;
      if (item.correct) subjects[item.subjectId].correct++;
    });

    return Object.values(subjects).map((subject) => ({
      ...subject,
      accuracy: subject.total > 0 ? (subject.correct / subject.total) * 100 : 0,
    }));
  };

  const subjectPerformance = getSubjectPerformance();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Performance Analytics
                </h1>
                <p className="text-gray-600 mt-1">
                  Detailed insights into your learning progress
                </p>
              </div>
            </div>
            <div>
              <Link to={`/leaderboard?testId=${testId}`}>
                <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                  Leaderboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Questions Attempted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {state.totalAttempted}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {state.overallAccuracy.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {state.currentStreak}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Best Streak</p>
                <p className="text-2xl font-bold text-gray-900">{maxStreak}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Candlestick Chart */}
        <div className="mb-8">
          <CandlestickChart data={state.candlestickData} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <TradingViewChart data={chartData} />
          </div>

          <div className="space-y-6">
            {/* Subject Performance */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Subject Performance
                </h3>
              </div>
              <div className="p-6">
                {subjectPerformance.length > 0 ? (
                  <div className="space-y-4">
                    {subjectPerformance.map((subject) => (
                      <div key={subject.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {subject.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            {subject.accuracy.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${subject.accuracy}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {subject.correct}/{subject.total} correct
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No data available yet. Start practicing to see your
                    performance!
                  </p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                {state.performance.length > 0 ? (
                  <div className="space-y-3">
                    {state.performance
                      .slice(-5)
                      .reverse()
                      .map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${
                              item.correct ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {item.subjectId} •{" "}
                              {item.correct ? "Correct" : "Incorrect"}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No recent activity. Start practicing to see your history!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
