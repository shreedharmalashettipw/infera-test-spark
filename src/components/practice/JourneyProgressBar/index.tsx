
import React from "react";
import { Circle, CircleDot } from "lucide-react";
import { usePractice } from "@/contexts/PracticeContext";

const JourneyProgressBar: React.FC = () => {
  const { state } = usePractice();
  const { currentQuestion } = state;

  if (!currentQuestion?.progress) {
    return null;
  }

  const journeyItems = currentQuestion.progress.journeyItems;
  const currentJourneyItemId = currentQuestion.journeyItemId;

  if (!journeyItems) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Journey</h3>
        
        <div className="relative">
          {/* Journey Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
          
          {/* Journey Items */}
          <div className="flex justify-between items-center relative">
            {journeyItems.map((item, index) => {
              const isCurrentItem = item._id === currentJourneyItemId;
              const isCompleted = item.isCompleted;
              
              return (
                <div key={item._id} className="flex flex-col items-center group">
                  {/* Circle Item */}
                  <div className={`
                    relative z-10 w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-200 hover:scale-110
                    ${isCurrentItem 
                      ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-200' 
                      : isCompleted 
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }
                  `}>
                    {isCurrentItem ? (
                      <CircleDot className="w-6 h-6" />
                    ) : isCompleted ? (
                      <div className="text-lg font-bold">✓</div>
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </div>
                  
                  {/* Item Info */}
                  <div className="mt-3 text-center max-w-32">
                    <div className={`
                      text-sm font-medium truncate
                      ${isCurrentItem ? 'text-blue-600' : 'text-gray-700'}
                    `}>
                      {item.title}
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute z-20 mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-64 transform -translate-x-1/2 left-1/2 transition-opacity duration-200">
                      <div className="font-semibold mb-1">{item.title}</div>
                      <div>{item.note}</div>
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyProgressBar;
