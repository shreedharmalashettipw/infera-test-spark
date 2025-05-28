const podiumData = [
  {
    position: "2nd",
    gradient: "bg-gradient-to-b from-purple-500 to-purple-700",
    avatar: "https://i.pravatar.cc/80?img=32",
  },
  {
    position: "1st",
    gradient: "bg-gradient-to-b from-yellow-500 to-yellow-600",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    position: "3rd",
    gradient: "bg-gradient-to-b from-purple-700 to-purple-900",
    avatar: "https://i.pravatar.cc/80?img=45",
  },
];

export default function Podium() {
  return (
    <div className="flex justify-center items-end bg-gray-900 px-8">
      {podiumData.map((item, idx) => (
        <div
          key={idx}
          className={`flex flex-col items-center mx-4 ${
            idx === 1 ? "order-2" : idx === 0 ? "order-1" : "order-3"
          }`}
        >
          <div
            className={`${item.gradient} rounded-t-lg rounded-b-lg w-40 ${
              idx === 1 ? "h-64" : "h-52"
            } relative flex flex-col items-center pt-4`}
          >
            {/* Laurel wreath */}
            <div className="absolute top-2">
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {item.position.toUpperCase()}
              </span>
            </div>
            {/* Avatar overlapping bottom */}
            <img
              src={item.avatar}
              alt="avatar"
              className={`absolute w-20 h-20 rounded-full border-4 border-white shadow-lg bottom-[-2.5rem]`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
