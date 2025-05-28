import React from "react";
import { PracticeProvider } from "@/contexts/PracticeContext";
import JourneyScreen from "./JourneyScreen";

const Index: React.FC = () => {
  return (
    <PracticeProvider>
      <JourneyScreen />
    </PracticeProvider>
  );
};

export default Index;
