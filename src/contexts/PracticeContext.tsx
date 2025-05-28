import React, { createContext, useContext, useReducer, ReactNode } from 'react';

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

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  subjectId: string;
  chapterId: string;
  topicId: string;
  difficulty: 'easy' | 'medium' | 'hard';
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

export interface PracticeState {
  currentQuestion: Question | null;
  selectedFilters: {
    subjects: string[];
    chapters: string[];
    topics: string[];
  };
  performance: PerformanceData[];
  currentStreak: number;
  totalAttempted: number;
  totalCorrect: number;
  overallAccuracy: number;
  isLoading: boolean;
}

type PracticeAction =
  | { type: 'SET_CURRENT_QUESTION'; payload: Question }
  | { type: 'UPDATE_FILTERS'; payload: Partial<PracticeState['selectedFilters']> }
  | { type: 'ADD_PERFORMANCE_DATA'; payload: PerformanceData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_PRACTICE' };

const initialState: PracticeState = {
  currentQuestion: null,
  selectedFilters: {
    subjects: [],
    chapters: [],
    topics: [],
  },
  performance: [],
  currentStreak: 0,
  totalAttempted: 0,
  totalCorrect: 0,
  overallAccuracy: 0,
  isLoading: false,
};

const practiceReducer = (state: PracticeState, action: PracticeAction): PracticeState => {
  switch (action.type) {
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestion: action.payload };
    
    case 'UPDATE_FILTERS':
      return {
        ...state,
        selectedFilters: { ...state.selectedFilters, ...action.payload },
      };
    
    case 'ADD_PERFORMANCE_DATA':
      const newPerformance = [...state.performance, action.payload];
      const totalAttempted = newPerformance.length;
      const totalCorrect = newPerformance.filter(p => p.correct).length;
      const overallAccuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
      
      return {
        ...state,
        performance: newPerformance,
        currentStreak: action.payload.streak,
        totalAttempted,
        totalCorrect,
        overallAccuracy,
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'RESET_PRACTICE':
      return initialState;
    
    default:
      return state;
  }
};

const PracticeContext = createContext<{
  state: PracticeState;
  dispatch: React.Dispatch<PracticeAction>;
  fetchNextQuestion: () => Promise<void>;
  submitAnswer: (answerIndex: number) => Promise<void>;
} | null>(null);

export const PracticeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(practiceReducer, initialState);

  const generateDummyPerformance = (): PerformanceData[] => {
    const data: PerformanceData[] = [];
    const subjects = ['math', 'physics'];
    const chapters = ['algebra', 'geometry', 'mechanics'];
    const topics = ['linear-eq', 'quadratic', 'triangles', 'circles', 'motion', 'forces'];
    
    // Generate performance data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate 5-15 questions per day
      const questionsPerDay = Math.floor(Math.random() * 10) + 5;
      
      for (let j = 0; j < questionsPerDay; j++) {
        const timestamp = date.getTime() + (j * 60000 * 15); // 15 minutes apart
        const correct = Math.random() > 0.3; // 70% accuracy
        const streak = correct ? Math.floor(Math.random() * 5) + 1 : 0;
        
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

  const dummyPerformance = generateDummyPerformance();

  const mockSubjects: Subject[] = [
    {
      id: 'math',
      name: 'Mathematics',
      chapters: [
        {
          id: 'algebra',
          name: 'Algebra',
          subjectId: 'math',
          topics: [
            { id: 'linear-eq', name: 'Linear Equations', chapterId: 'algebra' },
            { id: 'quadratic', name: 'Quadratic Equations', chapterId: 'algebra' },
          ],
        },
        {
          id: 'geometry',
          name: 'Geometry',
          subjectId: 'math',
          topics: [
            { id: 'triangles', name: 'Triangles', chapterId: 'geometry' },
            { id: 'circles', name: 'Circles', chapterId: 'geometry' },
          ],
        },
      ],
    },
    {
      id: 'physics',
      name: 'Physics',
      chapters: [
        {
          id: 'mechanics',
          name: 'Mechanics',
          subjectId: 'physics',
          topics: [
            { id: 'motion', name: 'Motion', chapterId: 'mechanics' },
            { id: 'forces', name: 'Forces', chapterId: 'mechanics' },
          ],
        },
      ],
    },
  ];

  const mockQuestions: Question[] = [
    {
      id: '1',
      text: 'What is the value of x in the equation 2x + 5 = 15?',
      options: ['3', '5', '7', '10'],
      correctAnswer: 1,
      subjectId: 'math',
      chapterId: 'algebra',
      topicId: 'linear-eq',
      difficulty: 'easy',
    },
    {
      id: '2',
      text: 'What is the area of a circle with radius 3?',
      options: ['6π', '9π', '12π', '18π'],
      correctAnswer: 1,
      subjectId: 'math',
      chapterId: 'geometry',
      topicId: 'circles',
      difficulty: 'medium',
    },
    {
      id: '3',
      text: 'What is the acceleration due to gravity on Earth?',
      options: ['9.8 m/s²', '10 m/s²', '8.9 m/s²', '11 m/s²'],
      correctAnswer: 0,
      subjectId: 'physics',
      chapterId: 'mechanics',
      topicId: 'motion',
      difficulty: 'easy',
    },
  ];

  const fetchNextQuestion = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const randomQuestion = mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
    dispatch({ type: 'SET_CURRENT_QUESTION', payload: randomQuestion });
    dispatch({ type: 'SET_LOADING', payload: false });
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

    dispatch({ type: 'ADD_PERFORMANCE_DATA', payload: performanceData });
    
    // Auto-fetch next question after a short delay
    setTimeout(() => {
      fetchNextQuestion();
    }, 1000);
  };

  return (
    <PracticeContext.Provider value={{ state, dispatch, fetchNextQuestion, submitAnswer }}>
      {children}
    </PracticeContext.Provider>
  );
};

export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
};
