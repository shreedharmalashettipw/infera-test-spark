import React from "react";
import { PracticeProvider } from "@/contexts/PracticeContext";
import JourneyScreen from "./JourneyScreen";

const Index: React.FC = () => {
  return (
    <PracticeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <JourneyScreen />
        </div>
      </div>
    </PracticeProvider>
  );
};

export default Index;
