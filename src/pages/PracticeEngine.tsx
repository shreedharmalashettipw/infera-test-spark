
import React, { useEffect } from "react";
import { usePractice } from "@/contexts/PracticeContext";
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterBar from "@/components/practice/FilterBar";
import PerformanceStats from "@/components/practice/PerformanceStats";
import QuestionCard from "@/components/practice/QuestionCard";
import JourneyProgressBar from "@/components/practice/JourneyProgressBar";
import FeedbackButton from "@/components/practice/FeedbackButton";
import { useQueryParam } from "@/hooks/useQueryParam";

const PracticeEngine: React.FC = () => {
  const testId = useQueryParam("testId") as string;
  const { fetchNextQuestion } = usePractice();

  useEffect(() => {
    if (testId) {
      fetchNextQuestion(testId);
    }
  }, [testId]);

  const handleFeedbackSubmit = (feedback: string) => {
    console.log("User feedback:", feedback);
    // TODO: Send feedback to your API endpoint
    // This will be integrated with your feedback API
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Beta Version - Practice Engine
                </h1>
                <p className="text-gray-600 mt-1">
                  AI-driven infinite test engine for adaptive learning
                </p>
              </div>
              <Link to="/analytics">
                <Button className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>
          {/* <FilterBar /> */}
          <PerformanceStats />
        </div>
      </div>

      {/* Journey Progress Bar */}
      <JourneyProgressBar />

      <div className="max-w-7xl mx-auto py-8">
        <QuestionCard />
      </div>

      {/* Feedback Button */}
      <FeedbackButton onSubmitFeedback={handleFeedbackSubmit} />
    </div>
  );
};

export default PracticeEngine;
