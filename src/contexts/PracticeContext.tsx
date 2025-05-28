import React, { createContext, useContext, useReducer, ReactNode } from "react";
import axios from "axios";
export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  subjectId: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  chapterId: string;
}

export type OptionType = {
  _id: string;
  text: string | number;
  isCorrect: boolean;
};

export interface Question {
  id: string;
  questionNumber: number;
  text: string;
  options: OptionType[];
  correctAnswer: number;
  subjectId: string;
  chapterId: string;
  topicId: string;
  difficulty: string;
  source: string;
  aiNote: string;
  concept: string;
}

export interface PerformanceData {
  timestamp: number;
  correct: boolean;
  accuracy: number;
  streak: number;
  subjectId: string;
  chapterId: string;
  topicId: string;
}

export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  date: string;
}

export interface PracticeState {
  currentQuestion: Question | null;
  selectedFilters: {
    subjects: string[];
    chapters: string[];
    topics: string[];
  };
  performance: PerformanceData[];
  candlestickData: CandlestickData[];
  currentStreak: number;
  totalAttempted: number;
  totalCorrect: number;
  overallAccuracy: number;
  isLoading: boolean;
}

type PracticeAction =
  | { type: "SET_CURRENT_QUESTION"; payload: Question }
  | {
      type: "UPDATE_FILTERS";
      payload: Partial<PracticeState["selectedFilters"]>;
    }
  | { type: "ADD_PERFORMANCE_DATA"; payload: PerformanceData }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET_PRACTICE" };

const initialState: PracticeState = {
  currentQuestion: null,
  selectedFilters: {
    subjects: [],
    chapters: [],
    topics: [],
  },
  performance: [],
  candlestickData: [],
  currentStreak: 0,
  totalAttempted: 0,
  totalCorrect: 0,
  overallAccuracy: 0,
  isLoading: false,
};

const practiceReducer = (
  state: PracticeState,
  action: PracticeAction
): PracticeState => {
  switch (action.type) {
    case "SET_CURRENT_QUESTION":
      return { ...state, currentQuestion: action.payload };

    case "UPDATE_FILTERS":
      return {
        ...state,
        selectedFilters: { ...state.selectedFilters, ...action.payload },
      };

    case "ADD_PERFORMANCE_DATA":
      const newPerformance = [...state.performance, action.payload];
      const totalAttempted = newPerformance.length;
      const totalCorrect = newPerformance.filter((p) => p.correct).length;
      const overallAccuracy =
        totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;

      return {
        ...state,
        performance: newPerformance,
        currentStreak: action.payload.streak,
        totalAttempted,
        totalCorrect,
        overallAccuracy,
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "RESET_PRACTICE":
      return initialState;

    default:
      return state;
  }
};

const PracticeContext = createContext<{
  state: PracticeState;
  dispatch: React.Dispatch<PracticeAction>;
  fetchNextQuestion: (testId: string) => Promise<void>;
  submitAnswer: (answerIndex: number) => Promise<void>;
} | null>(null);

export const PracticeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(practiceReducer, initialState);

  const generateDummyPerformance = (): PerformanceData[] => {
    const data: PerformanceData[] = [];
    const subjects = ["math", "physics"];
    const chapters = ["algebra", "geometry", "mechanics"];
    const topics = [
      "linear-eq",
      "quadratic",
      "triangles",
      "circles",
      "motion",
      "forces",
    ];

    // Generate performance data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Generate 5-20 questions per day
      const questionsPerDay = Math.floor(Math.random() * 15) + 5;

      for (let j = 0; j < questionsPerDay; j++) {
        const timestamp = date.getTime() + j * 60000 * 10; // 10 minutes apart
        const correct = Math.random() > 0.25; // 75% accuracy
        const streak = correct ? Math.floor(Math.random() * 8) + 1 : 0;

        data.push({
          timestamp,
          correct,
          accuracy: correct ? 100 : 0,
          streak,
          subjectId: subjects[Math.floor(Math.random() * subjects.length)],
          chapterId: chapters[Math.floor(Math.random() * chapters.length)],
          topicId: topics[Math.floor(Math.random() * topics.length)],
        });
      }
    }

    return data.sort((a, b) => a.timestamp - b.timestamp);
  };

  const generateCandlestickData = (): CandlestickData[] => {
    const data: CandlestickData[] = [];
    let currentAccuracy = 70; // Starting accuracy

    // Generate candlestick data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Generate OHLC data based on accuracy
      const open = currentAccuracy;
      const volatility = Math.random() * 20 - 10; // -10 to +10
      const high = Math.min(
        100,
        open + Math.abs(volatility) + Math.random() * 10
      );
      const low = Math.max(0, open - Math.abs(volatility) - Math.random() * 10);
      const close = low + Math.random() * (high - low);

      currentAccuracy = close; // Next day starts where this day ended

      data.push({
        timestamp: date.getTime(),
        open: Number(open.toFixed(1)),
        high: Number(high.toFixed(1)),
        low: Number(low.toFixed(1)),
        close: Number(close.toFixed(1)),
        volume: Math.floor(Math.random() * 50) + 10,
        date: date.toLocaleDateString(),
      });
    }

    return data;
  };

  const dummyPerformance = generateDummyPerformance();
  const dummyCandlestickData = generateCandlestickData();

  // Update initial state with dummy data
  React.useEffect(() => {
    if (state.performance.length === 0) {
      dummyPerformance.forEach((perf) => {
        dispatch({ type: "ADD_PERFORMANCE_DATA", payload: perf });
      });

      // Add candlestick data to state
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  }, []);

  const fetchNextQuestion = async (testId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_CURRENT_QUESTION", payload: null });

    try {
      // Replace 'API_URL' with the actual endpoint for fetching the next question
      const response = await axios.get(
        "https://stage-api.penpencil.co/v3/test-service/test-categories/infera-practice/next-question",
        {
          params: {
            testId,
          },
          headers: {
            userid: "{{userId}}", // Replace with actual userId value or pass dynamically
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDkwMzAwMjYuNjA2LCJkYXRhIjp7Il9pZCI6IjY1YThlM2NhNDM2NzQ5NmNlNjVjMTU4MSIsInVzZXJuYW1lIjoiNzk4MjE3MzUyMyIsImZpcnN0TmFtZSI6IlJhamEiLCJsYXN0TmFtZSI6IkJoYW5kYXJkZSIsIm9yZ2FuaXphdGlvbiI6eyJfaWQiOiI1ZWIzOTNlZTk1ZmFiNzQ2OGE3OWQxODkiLCJ3ZWJzaXRlIjoicGh5c2ljc3dhbGxhaC5jb20iLCJuYW1lIjoiUGh5c2ljc3dhbGxhaCJ9LCJlbWFpbCI6InJhamFAcHcubGl2ZSIsInJvbGVzIjpbIjViMmI5NzQyNzY0YmQ1MTliZWI5MGFjMiJdLCJjb3VudHJ5R3JvdXAiOiJJTiIsInR5cGUiOiJVU0VSIn0sImlhdCI6MTc0ODQyNTIyNn0.OKNVRduYPzxVN0L40_Vm9ARN5wXZfbAcnXvsk4PbIQs",
          },
        }
      );

      const data = response.data?.data;
      const getCorrectAnswerIndex = (options): number => {
        return options.findIndex((option) => option.isCorrect);
      };

      if (data) {
        const question: Question = {
          ...data,
          correctAnswer: getCorrectAnswerIndex(data.options),
        };

        dispatch({ type: "SET_CURRENT_QUESTION", payload: question });
      }
    } catch (error) {
      console.error("Error fetching the next question:", error);
      // Handle error (e.g., show a notification or set an error state)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const submitAnswer = async (answerIndex: number) => {
    if (!state.currentQuestion) return;

    const isCorrect = answerIndex === state.currentQuestion.correctAnswer;
    const newStreak = isCorrect ? state.currentStreak + 1 : 0;

    const performanceData: PerformanceData = {
      timestamp: Date.now(),
      correct: isCorrect,
      accuracy: isCorrect ? 100 : 0,
      streak: newStreak,
      subjectId: state.currentQuestion.subjectId,
      chapterId: state.currentQuestion.chapterId,
      topicId: state.currentQuestion.topicId,
    };

    dispatch({ type: "ADD_PERFORMANCE_DATA", payload: performanceData });
  };

  // Create state with dummy candlestick data
  const stateWithData = {
    ...state,
    candlestickData: dummyCandlestickData,
  };

  return (
    <PracticeContext.Provider
      value={{
        state: stateWithData,
        dispatch,
        fetchNextQuestion,
        submitAnswer,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
};

export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error("usePractice must be used within a PracticeProvider");
  }
  return context;
};
