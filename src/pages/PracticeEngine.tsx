import React, { useEffect, useMemo, useState } from "react";
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
import Modal from "react-modal";

const PracticeEngine: React.FC = () => {
  const testId = useQueryParam("testId") as string;
  const { fetchNextQuestion, state } = usePractice();

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const journeyItems = state.currentQuestion?.progress?.journeyItems || [];

  const currentJourneyItem = useMemo(() => {
    if (!journeyItems) return null;

    return journeyItems.find(
      (item) => item._id === state.currentQuestion.journeyItemId
    );
  }, [journeyItems]);

  const completedJourneyItems = useMemo(() => {
    if (!journeyItems) return [];

    return journeyItems.filter((item) => item.isCompleted);
  }, [journeyItems]);

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
                  Infera - Practice Engine
                </h1>
                <p className="text-gray-600 mt-1">
                  AI-driven infinite test engine for adaptive learning
                </p>
              </div>
              <Link to={`/analytics?testId=${testId}`}>
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
      {/* <JourneyProgressBar /> */}

      <div className="flex gap-x-[20px] max-w-7xl mx-auto py-8">
        {(currentJourneyItem || completedJourneyItems?.length > 0) && (
          <div className="flex w-[30%] flex-col gap-y-4">
            {currentJourneyItem && (
              <div className="w-full h-fit bg-white shadow-md rounded-lg p-4 border border-gray-200">
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  {currentJourneyItem.title}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {currentJourneyItem.note}
                </div>
                <button
                  onClick={openModal}
                  className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition duration-200"
                >
                  See Other Journey Items
                </button>
              </div>
            )}
            {completedJourneyItems?.length > 0 && (
              <div className="w-full h-fit bg-white shadow-md rounded-lg p-4 border border-gray-200">
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  Completed Concepts
                </div>
                <div
                  className="overflow-y-auto max-h-[400px] space-y-4"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {completedJourneyItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <span className="text-sm text-gray-800 font-medium">
                        {item.title}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div
          style={{
            width:
              currentJourneyItem || completedJourneyItems?.length > 0
                ? "70%"
                : "100%",
          }}
        >
          {currentJourneyItem && (
            <div className="text-sm text-gray-600 mb-4">
              The question displayed below is related to the concept:{" "}
              <span className="font-semibold text-gray-800">
                {currentJourneyItem?.title || "this concept"}
              </span>
            </div>
          )}
          <QuestionCard />
        </div>
      </div>

      {/* Feedback Button */}
      <FeedbackButton onSubmitFeedback={handleFeedbackSubmit} />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Journey Items Modal"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            borderRadius: "12px",
            width: "500px",
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            zIndex: 1050,
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1040,
          },
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Journey Items</h2>
          <button
            onClick={closeModal}
            className="text-gray-600 hover:text-gray-800 transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {journeyItems
            .filter((item) => item._id !== currentJourneyItem._id)
            .filter((item) => !item.isCompleted)
            .map((item) => (
              <div
                key={item._id}
                className="p-4 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition duration-200 cursor-pointer"
                onClick={() => {
                  fetchNextQuestion(testId, item.title);
                  closeModal();
                }}
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.note}</p>
              </div>
            ))}
        </div>
      </Modal>
    </div>
  );
};

export default PracticeEngine;
