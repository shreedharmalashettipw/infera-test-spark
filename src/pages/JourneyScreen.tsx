import { Link } from "react-router-dom";

const lessons = [
  { icon: "✅", bg: "bg-yellow-300" },
  { icon: "📖", bg: "bg-green-500" },
  { icon: "🪙", bg: "bg-yellow-500" },
  { icon: "🏋️‍♂️", bg: "bg-green-400" },
  { icon: "⏸️", bg: "bg-gray-300" },
  { icon: "⭐", bg: "bg-gray-300" },
  { icon: "🏆", bg: "bg-gray-300" },
];

function JourneyScreen() {
  return (
    <div className="px-20">
      <h3 className="text-3xl font-bold text-center flex items-center gap-2 mt-6">
        <span className="text-blue-500">🚀</span> {/* Icon */}
        Journey
      </h3>
      <div className="flex justify-end mt-4">
        <Link to="/leaderboard">
          <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
            Leaderboard
          </button>
        </Link>
      </div>
      <div className="relative w-full max-w-4xl mx-auto mt-8">
        <svg
          className="absolute w-full h-full"
          style={{ zIndex: -1 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {lessons.map((_, index) => {
            if (index === lessons.length - 1) return null; // Skip the last circle
            const startX =
              index % 2 === 0 ? 300 : window.innerWidth - 300 - 112; // Adjust for circle size
            const endX =
              (index + 1) % 2 === 0 ? 300 : window.innerWidth - 300 - 112;
            const startY = 20 + index * 120 + 56; // Center of the current circle
            const endY = 20 + (index + 1) * 120 + 56; // Center of the next circle

            return (
              <path
                key={index}
                d={`M${startX},${startY} C${startX},${
                  (startY + endY) / 2
                } ${endX},${(startY + endY) / 2} ${endX},${endY}`}
                stroke="gray"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
              />
            );
          })}
        </svg>
        {lessons.map((lesson, index) => {
          // calculate vertical position
          const top = 20 + index * 120; // Adjusted spacing for larger circles
          const isLeft = index % 2 === 0;
          return (
            <Link
              to={`/practice?day=${index + 1}&testId=67879831a7f3ff0ace47ba6d`}
              key={index}
            >
              <div
                key={index}
                className="absolute"
                style={{ top: top, [isLeft ? "left" : "right"]: 300 }}
                onClick={() => console.log("button clicked", index)}
              >
                <div
                  className={`w-28 h-28 ${lesson.bg} rounded-full flex flex-col items-center justify-center text-white text-2xl shadow-md`}
                >
                  <span>{lesson.icon}</span>
                  <span className="text-sm mt-1">Day {index + 1}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default JourneyScreen;
