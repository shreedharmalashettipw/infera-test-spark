import { Question } from "@/contexts/PracticeContext";

export const getDifficultyColor = (level: string) => {
  switch (level) {
    case "easy":
      return "bg-green-100 text-green-800 border-green-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "hard":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getSourceColor = (source: string) => {
  switch (source) {
    case "QBG":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "AI":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getOptionClassName = (
  optionIndex: number,
  currentQuestion: Question,
  showResult: boolean,
  selectedOption: number | null
) => {
  const baseClasses =
    "w-full p-4 text-left border border-gray-300 rounded-lg transition-all duration-200 hover:border-blue-400 hover:bg-blue-50";

  if (!showResult) {
    return selectedOption === optionIndex
      ? `${baseClasses} border-blue-500 bg-blue-100`
      : baseClasses;
  }

  if (optionIndex === currentQuestion.correctAnswer) {
    return `${baseClasses} border-green-500 bg-green-100 text-green-800`;
  }

  if (
    selectedOption === optionIndex &&
    optionIndex !== currentQuestion.correctAnswer
  ) {
    return `${baseClasses} border-red-500 bg-red-100 text-red-800`;
  }

  return `${baseClasses} opacity-50`;
};
