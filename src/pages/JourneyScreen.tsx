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
    <div className="bg-white py-6 px-4 overflow-y-auto h-[800px]">
      {/* Curved Path Container */}
      <div className="relative w-full max-w-3xl mx-auto mt-16" style={{}}>
        {/* Lesson Nodes */}
        {lessons.map((lesson, index) => {
          // calculate vertical position
          const top = 20 + index * 90;
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
                onClick={() => console.log("button cliked", index)}
              >
                <div
                  className={`w-20 h-20 ${lesson.bg} rounded-full flex items-center justify-center text-white text-2xl shadow-md`}
                >
                  {lesson.icon}
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
