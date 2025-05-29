import React from "react";
import { PracticeProvider } from "@/contexts/PracticeContext";
import { Link } from "react-router-dom";
import { Brain, BarChart3, Target, Zap, ArrowRight } from "lucide-react";

const Index: React.FC = () => {
  return (
    <PracticeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              AI-Powered Learning Engine
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Infera Practice Engine
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience unlimited adaptive learning with our AI-driven test
              engine. Get personalized questions that adapt to your skill level
              and track your progress with advanced analytics.
            </p>
          </div>
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Adaptive Questions
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI engine selects questions based on your performance,
                ensuring optimal learning curve and difficulty progression.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Infinite Practice
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Never run out of questions. Practice endlessly with our vast
                question bank across multiple subjects and topics.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Track your progress with TradingView-style charts and detailed
                performance insights across all subjects.
              </p>
            </div>
          </div>

          {/* Quick Stats Preview */}
          <div className="mt-20 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Why Choose Infera?
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">∞</div>
                <p className="text-gray-600">Unlimited Questions</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">AI</div>
                <p className="text-gray-600">Adaptive Learning</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  📊
                </div>
                <p className="text-gray-600">Real-time Analytics</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  🎯
                </div>
                <p className="text-gray-600">Performance Tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PracticeProvider>
  );
};

export default Index;
