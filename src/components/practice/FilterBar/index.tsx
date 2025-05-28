import React from "react";
import { ChevronDown } from "lucide-react";
import { usePractice } from "@/contexts/PracticeContext";

const FilterBar: React.FC = () => {
  const { state, dispatch } = usePractice();

  const mockSubjects = [
    { id: "math", name: "Mathematics" },
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
  ];

  const mockChapters = [
    { id: "algebra", name: "Algebra", subjectId: "math" },
    { id: "geometry", name: "Geometry", subjectId: "math" },
    { id: "mechanics", name: "Mechanics", subjectId: "physics" },
  ];

  const mockTopics = [
    { id: "linear-eq", name: "Linear Equations", chapterId: "algebra" },
    { id: "quadratic", name: "Quadratic Equations", chapterId: "algebra" },
    { id: "triangles", name: "Triangles", chapterId: "geometry" },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative">
          <select
            className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="">All Subjects</option>
            {mockSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="">All Chapters</option>
            {mockChapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="">All Topics</option>
            {mockTopics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
