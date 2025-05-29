import React, { useState } from "react";
import { Clock, BookOpen, Star, Lightbulb } from "lucide-react";
import { usePractice } from "@/contexts/PracticeContext";
import {
  getDifficultyColor,
  getOptionClassName,
  getSourceColor,
} from "./questionCard.utils";
import { useQueryParam } from "@/hooks/useQueryParam";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const QuestionCard: React.FC = () => {
  const testId = useQueryParam("testId") as string;
  const userId = useQueryParam("userId") as string;
  const { state, submitAnswer, fetchNextQuestion } = usePractice();
  const { currentQuestion } = state;

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [pendingAnswerIndex, setPendingAnswerIndex] = useState<number | null>(
    null
  );

  if (!currentQuestion) {
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

    // If the question can be completed, show the completion dialog first
    if (currentQuestion.canBeCompleted) {
      setPendingAnswerIndex(optionIndex);
      setShowCompletionDialog(true);
      return;
    }

    // Otherwise, submit directly
    setShowResult(true);
    await submitAnswer(optionIndex, userId);
  };

  const handleCompleteJourney = async () => {
    if (pendingAnswerIndex === null) return;

    setShowCompletionDialog(false);
    setShowResult(true);
    await submitAnswer(pendingAnswerIndex, userId, true);
    setPendingAnswerIndex(null);
  };

  const handleSkipCompletion = async () => {
    if (pendingAnswerIndex === null) return;

    setShowCompletionDialog(false);
    setShowResult(true);
    await submitAnswer(pendingAnswerIndex, userId, false);
    setPendingAnswerIndex(null);
  };

  const handleNextButtonClick = () => {
    setShowResult(false);
    setSelectedOption(null);
    fetchNextQuestion(testId, userId);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm opacity-90">
                  Question {currentQuestion.questionNumber}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                  currentQuestion.difficulty
                )}`}
              >
                {currentQuestion.difficulty}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getSourceColor(
                  currentQuestion.source
                )}`}
              >
                {currentQuestion.source}
              </span>
            </div>

            <h2 className="text-xl font-semibold leading-relaxed">
              {state.currentQuestion.text}
            </h2>
          </div>

          {/* Concept Recommendation Note */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 m-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-amber-800">
                    Concept: {currentQuestion.concept}
                  </span>
                </div>
                <p className="text-sm text-amber-700">
                  {currentQuestion.aiNote}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-3">
              {state.currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showResult}
                  className={getOptionClassName(
                    index,
                    currentQuestion,
                    showResult,
                    selectedOption
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-base">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {showResult && (
              <div className="flex justify-between mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
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
                      : `Incorrect. The correct answer is ${String.fromCharCode(
                          65 + state.currentQuestion.correctAnswer
                        )}.`}
                  </span>
                </div>
                <button
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  onClick={handleNextButtonClick}
                >
                  Next Question
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Journey Item?</AlertDialogTitle>
            <AlertDialogDescription>
              You've mastered this concept! Would you like to mark this journey
              item as completed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSkipCompletion}>
              Skip for now
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCompleteJourney}>
              Yes, complete it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default QuestionCard;
